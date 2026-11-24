// 기록 도구(트레이서). tools/trace.mjs 가 부른다. 표준 입력으로 요청 JSON 을 받고, 표준 출력으로 기록 JSON 을 낸다.
//   요청: { "file": "samples/<id>/X.cs", "source": "...", "runs": [ { "key": "...", "mistake": false, "values": { "count": "3" } } ] }
//   결과: { "runs": { "<key>": { "normal": 기록, "mistake": 기록 } }, "errors": [ ... ] }
// 하는 일 (원본 파일은 건드리지 않는다):
//   1. // @param <key> 가 붙은 선언의 초기값을 values 로 바꾼다 (줄 수는 그대로)
//   2. 메서드·생성자·로컬 함수의 본문 문장마다 앞에 __T.L(원래 줄, 보이는 변수...) 을 끼우고, 본문을 __T.Enter / Exit 로 감싼다
//   3. C# 9 로 컴파일해 메모리에서 실행하고 런타임(Runtime.cs)이 모은 기록을 받는다
// 한계: 선언할 때 초기화하지 않은 지역 변수, 속성 접근자·람다 안 문장, out 매개변수는 기록하지 않는다 (docs/specimen-guide.md).
// ref · in 매개변수는 부른 쪽 변수(지역 변수, 매개변수, 정적 필드)와 잇는다. 부르는 문장 앞에서 __T.RefArg 로 남기고 Enter 가 가져간다.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using static Microsoft.CodeAnalysis.CSharp.SyntaxFactory;

// 콘솔 기본 인코딩(한국어 Windows 는 CP949)이 아니라 UTF-8 로 주고받는다
var stdout = new StreamWriter(Console.OpenStandardOutput(), new UTF8Encoding(false));
var request = JsonNode.Parse(new StreamReader(Console.OpenStandardInput(), new UTF8Encoding(false)).ReadToEnd())!.AsObject();
string file = (string)request["file"]!;
string source = ((string)request["source"]!).Replace("\r\n", "\n");
var result = new JsonObject();
var runs = new JsonObject();
var errors = new JsonArray();
foreach (var run in request["runs"]!.AsArray())
{
    string key = (string)run!["key"]!;
    bool mistake = (bool)run["mistake"]!;
    var values = run["values"]?.AsObject().ToDictionary(p => p.Key, p => (string)p.Value!) ?? new Dictionary<string, string>();
    var (trace, error) = Tracer.Run(file, source, mistake, values);
    if (error != null)
    {
        errors.Add($"{(key == "" ? "기본" : key)}{(mistake ? " (GALLERY_MISTAKE)" : "")}: {error}");
        continue;
    }
    if (runs[key] is not JsonObject slot) runs[key] = slot = new JsonObject();
    slot[mistake ? "mistake" : "normal"] = trace;
}
Console.SetOut(stdout);
result["runs"] = runs;
result["errors"] = errors;
stdout.Write(result.ToJsonString(new JsonSerializerOptions { Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping }));
stdout.Flush();
return errors.Count == 0 ? 0 : 1;

static class Tracer
{
    static readonly CSharpParseOptions Parse9 = new(LanguageVersion.CSharp9);

    public static (JsonNode trace, string error) Run(string file, string source, bool mistake, Dictionary<string, string> values)
    {
        var options = Parse9.WithPreprocessorSymbols(mistake ? new[] { "GALLERY_MISTAKE" } : Array.Empty<string>());
        var original = CSharpSyntaxTree.ParseText(source, options, file);
        var (withValues, missing) = ApplyParams(original, values);
        if (missing.Count > 0) return (null, $"// @param 이 붙은 선언을 찾지 못한 값: {string.Join(", ", missing)}");
        var tree = CSharpSyntaxTree.ParseText(withValues, options, file);

        // 원본 그대로 먼저 컴파일해 본다 (표본 자체의 오류는 원래 줄 번호로 알린다)
        var plain = Compile(new[] { tree });
        var plainErrors = plain.GetDiagnostics().Where(d => d.Severity == DiagnosticSeverity.Error).ToList();
        if (plainErrors.Count > 0) return (null, "컴파일 오류\n" + string.Join("\n", plainErrors.Take(10).Select(d => d.ToString())));

        var model = plain.GetSemanticModel(tree);
        var instrumented = new Instrument(model).Visit(tree.GetRoot());
        var runtime = CSharpSyntaxTree.ParseText(RuntimeSource(), options, "Runtime.cs");
        var compilation = Compile(new[] { CSharpSyntaxTree.Create((CSharpSyntaxNode)instrumented, options, file, Encoding.UTF8), runtime });
        using var pe = new MemoryStream();
        var emit = compilation.Emit(pe);
        if (!emit.Success)
        {
            var text = instrumented.ToFullString();
            return (null, "기록 사본이 컴파일되지 않는다 (트레이서가 처리하지 못하는 문법)\n" + string.Join("\n", emit.Diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error).Take(10).Select(d => $"{d}  | {LineAt(text, d)}")));
        }

        var context = new AssemblyLoadContext("trace", isCollectible: true);
        try
        {
            pe.Position = 0;
            var asm = context.LoadFromStream(pe);
            var t = asm.GetType("__T")!;
            t.GetMethod("Begin")!.Invoke(null, null);
            var entry = asm.EntryPoint ?? throw new InvalidOperationException("Main 이 없다");
            string error = null;
            bool limit = false;
            var thread = new Thread(() =>
            {
                try
                {
                    entry.Invoke(null, entry.GetParameters().Length == 0 ? null : new object[] { Array.Empty<string>() });
                }
                catch (TargetInvocationException e) when (e.InnerException?.GetType().Name == "__GalleryTraceLimit")
                {
                    limit = true;
                    error = e.InnerException.Message;
                }
                catch (TargetInvocationException e)
                {
                    var inner = e.InnerException!;
                    error = $"{inner.GetType().Name}: {inner.Message}";
                }
            }, 16 * 1024 * 1024);
            thread.Start();
            if (!thread.Join(TimeSpan.FromSeconds(20))) return (null, "20초 안에 끝나지 않았다");
            var json = (string)t.GetMethod("Result")!.Invoke(null, new object[] { error, limit })!;
            if (limit) return (null, error);
            return (JsonNode.Parse(json), null);
        }
        finally
        {
            context.Unload();
        }
    }

    static string LineAt(string text, Diagnostic d)
    {
        int line = d.Location.GetLineSpan().StartLinePosition.Line;
        return text.Split('\n').ElementAtOrDefault(line)?.Trim() ?? "";
    }

    /// 표본과 함께 컴파일하는 기록 런타임 (빌드 출력 폴더에 복사된다)
    static string RuntimeSource() => File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Runtime.cs.txt"), Encoding.UTF8);

    static readonly MetadataReference[] References = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!)
        .Split(Path.PathSeparator)
        .Where(p => Path.GetFileName(p).StartsWith("System") || Path.GetFileName(p) is "mscorlib.dll" or "netstandard.dll")
        .Select(p => (MetadataReference)MetadataReference.CreateFromFile(p))
        .ToArray();

    static CSharpCompilation Compile(IEnumerable<SyntaxTree> trees) =>
        CSharpCompilation.Create("Sample", trees, References, new CSharpCompilationOptions(OutputKind.ConsoleApplication, nullableContextOptions: NullableContextOptions.Disable));

    static readonly Regex ParamMark = new(@"//.*@param\s+(\w+)");

    /// // @param key 가 붙은 줄의 선언 초기값을 바꾼다. 값은 C# 식 그대로 (select 의 value)
    static (SourceText text, List<string> missing) ApplyParams(SyntaxTree tree, Dictionary<string, string> values)
    {
        var text = tree.GetText();
        var changes = new List<TextChange>();
        var found = new HashSet<string>();
        foreach (var d in tree.GetRoot().DescendantNodes().OfType<VariableDeclaratorSyntax>())
        {
            if (d.Initializer == null) continue;
            var line = text.Lines[d.GetLocation().GetLineSpan().StartLinePosition.Line].ToString();
            var m = ParamMark.Match(line);
            if (!m.Success || !values.TryGetValue(m.Groups[1].Value, out var v)) continue;
            changes.Add(new TextChange(d.Initializer.Value.Span, v));
            found.Add(m.Groups[1].Value);
        }
        return (text.WithChanges(changes), values.Keys.Where(k => !found.Contains(k)).ToList());
    }
}

/// 문장마다 기록 호출을 끼운다. 줄 번호와 보이는 변수는 원래 트리(node)에서 구한다
sealed class Instrument : CSharpSyntaxRewriter
{
    readonly SemanticModel model;
    public Instrument(SemanticModel model) => this.model = model;

    static int Line(SyntaxNode n) => n.GetLocation().GetLineSpan().StartLinePosition.Line + 1;

    /// 기록할 문장인가: 메서드·생성자·로컬 함수의 블록 본문 안이고 람다·접근자 안이 아니다
    static bool Traceable(StatementSyntax s)
    {
        if (s is BlockSyntax or LocalFunctionStatementSyntax) return false;
        for (SyntaxNode p = s.Parent; p != null; p = p.Parent)
        {
            if (p is AnonymousFunctionExpressionSyntax or AccessorDeclarationSyntax) return false;
            if (p is MethodDeclarationSyntax or ConstructorDeclarationSyntax or LocalFunctionStatementSyntax) return true;
            if (p is MemberDeclarationSyntax) return false;
        }
        return false;
    }

    /// 이 문장 앞에서 보이고 값이 확실히 정해진 이름들 (가까운 것부터)
    List<(string code, string label, bool isRef)> Visible(StatementSyntax s)
    {
        var names = new List<(string, string, bool)>();
        var seen = new HashSet<string>();
        void Add(SyntaxToken id, bool isRef = false)
        {
            if (seen.Add(id.ValueText)) names.Add((id.Text, id.ValueText, isRef));
        }
        void AddDecl(VariableDeclarationSyntax decl)
        {
            if (decl == null) return;
            foreach (var v in decl.Variables) if (v.Initializer != null) Add(v.Identifier);
        }
        SyntaxNode cur = s;
        while (cur.Parent != null)
        {
            var parent = cur.Parent;
            switch (parent)
            {
                case BlockSyntax b:
                    foreach (var st in b.Statements.TakeWhile(x => x != cur).Reverse())
                        if (st is LocalDeclarationStatementSyntax ld && !ld.IsConst) AddDecl(ld.Declaration);
                    break;
                case SwitchSectionSyntax sec:
                    foreach (var st in sec.Statements.TakeWhile(x => x != cur).Reverse())
                        if (st is LocalDeclarationStatementSyntax ld && !ld.IsConst) AddDecl(ld.Declaration);
                    break;
                case ForStatementSyntax f when cur == f.Statement:
                    AddDecl(f.Declaration);
                    break;
                case ForEachStatementSyntax fe when cur == fe.Statement:
                    Add(fe.Identifier);
                    break;
                case UsingStatementSyntax u when cur == u.Statement:
                    AddDecl(u.Declaration);
                    break;
                case CatchClauseSyntax c when c.Declaration != null && c.Declaration.Identifier.ValueText != "":
                    Add(c.Declaration.Identifier);
                    break;
            }
            if (parent is BaseMethodDeclarationSyntax or LocalFunctionStatementSyntax)
            {
                var ps = parent is BaseMethodDeclarationSyntax m ? m.ParameterList : ((LocalFunctionStatementSyntax)parent).ParameterList;
                foreach (var p in ps.Parameters.Reverse())
                    if (!p.Modifiers.Any(SyntaxKind.OutKeyword)) Add(p.Identifier, IsRefParam(p));
                bool isStatic = parent is BaseMethodDeclarationSyntax bm ? bm.Modifiers.Any(SyntaxKind.StaticKeyword) : ((LocalFunctionStatementSyntax)parent).Modifiers.Any(SyntaxKind.StaticKeyword);
                var type = parent.Ancestors().OfType<TypeDeclarationSyntax>().FirstOrDefault();
                bool structCtor = parent is ConstructorDeclarationSyntax && type is StructDeclarationSyntax;
                // 로컬 함수의 this 는 바깥 메서드를 따른다
                if (parent is LocalFunctionStatementSyntax)
                {
                    var outer = parent.Ancestors().OfType<BaseMethodDeclarationSyntax>().FirstOrDefault();
                    isStatic = isStatic || outer == null || outer.Modifiers.Any(SyntaxKind.StaticKeyword);
                    structCtor = outer is ConstructorDeclarationSyntax && type is StructDeclarationSyntax;
                }
                if (!isStatic && !structCtor && type != null) names.Add(("this", "this", false));
                break;
            }
            cur = parent;
        }
        names.Reverse();
        return names;
    }

    static bool IsRefParam(ParameterSyntax p) => p.Modifiers.Any(SyntaxKind.RefKeyword) || p.Modifiers.Any(SyntaxKind.InKeyword);

    /// 문장 앞에 끼우는 기록: __T.L(줄, 보이는 변수...) 과, 이 문장이 부르는 메서드의 ref 인자 (__T.RefArg)
    List<StatementSyntax> LineCall(StatementSyntax original)
    {
        var args = new List<ArgumentSyntax> { Argument(LiteralExpression(SyntaxKind.NumericLiteralExpression, Literal(Line(original)))) };
        foreach (var (code, label, isRef) in Visible(original))
            args.Add(Argument(ParseExpression($"__T.{(isRef ? "VR" : "V")}({SymbolDisplay.FormatLiteral(label, true)}, {code})")));
        var list = new List<StatementSyntax> { ExpressionStatement(InvocationExpression(ParseExpression("__T.L"), ArgumentList(SeparatedList(args)))).NormalizeWhitespace() };
        foreach (var (method, param, target) in RefArgs(original))
            list.Add(ParseStatement($"__T.RefArg({SymbolDisplay.FormatLiteral(method, true)}, {SymbolDisplay.FormatLiteral(param, true)}, {SymbolDisplay.FormatLiteral(target, true)});"));
        return list;
    }

    /// 이 문장(안쪽 문장 제외)이 부르는 표본 메서드의 ref · in 인자: (메서드 이름, 매개변수, 부른 쪽 변수)
    /// 부른 쪽 변수는 지역 변수·매개변수 이름, 정적 필드는 "static:형식.필드", 그 밖(배열 칸, 객체 필드)은 ""
    IEnumerable<(string method, string param, string target)> RefArgs(StatementSyntax original)
    {
        foreach (var inv in original.DescendantNodes().OfType<InvocationExpressionSyntax>())
        {
            if (inv.FirstAncestorOrSelf<StatementSyntax>() != original) continue;
            if (model.GetSymbolInfo(inv).Symbol is not IMethodSymbol m || !m.Locations.Any(l => l.IsInSource)) continue;
            var a = inv.ArgumentList.Arguments;
            for (int i = 0; i < a.Count; i++)
            {
                if (!a[i].RefKindKeyword.IsKind(SyntaxKind.RefKeyword) && !a[i].RefKindKeyword.IsKind(SyntaxKind.InKeyword)) continue;
                var p = a[i].NameColon != null ? m.Parameters.FirstOrDefault(x => x.Name == a[i].NameColon.Name.Identifier.ValueText) : i < m.Parameters.Length ? m.Parameters[i] : null;
                if (p == null) continue;
                string target = model.GetSymbolInfo(a[i].Expression).Symbol switch
                {
                    ILocalSymbol l when a[i].Expression is IdentifierNameSyntax => l.Name,
                    IParameterSymbol ps when a[i].Expression is IdentifierNameSyntax => ps.Name,
                    IFieldSymbol f when f.IsStatic => $"static:{f.ContainingType.Name}.{f.Name}",
                    _ => "",
                };
                yield return (m.Name, p.Name, target);
            }
        }
    }

    static readonly StatementSyntax Exit = ParseStatement("__T.Exit();");

    static BlockSyntax Frame(string name, BlockSyntax body) =>
        Block(
            ParseStatement($"__T.Enter({SymbolDisplay.FormatLiteral(name, true)});"),
            TryStatement(body, default, FinallyClause(Block(Exit))));

    public override SyntaxNode VisitBlock(BlockSyntax node)
    {
        var list = new List<StatementSyntax>();
        foreach (var s in node.Statements)
        {
            var visited = (StatementSyntax)Visit(s);
            if (Traceable(s)) list.AddRange(LineCall(s));
            list.Add(visited);
        }
        return node.WithStatements(List(list));
    }

    public override SyntaxNode VisitSwitchSection(SwitchSectionSyntax node)
    {
        var list = new List<StatementSyntax>();
        foreach (var s in node.Statements)
        {
            var visited = (StatementSyntax)Visit(s);
            if (Traceable(s)) list.AddRange(LineCall(s));
            list.Add(visited);
        }
        return node.WithLabels(VisitList(node.Labels)).WithStatements(List(list));
    }

    /// 블록이 아닌 곳에 놓인 문장 (if (x) y++; 의 y++) 은 { 기록; 문장 } 으로 감싼다
    StatementSyntax Embedded(StatementSyntax original)
    {
        var visited = (StatementSyntax)Visit(original);
        if (original is BlockSyntax || !Traceable(original)) return visited;
        return Block(LineCall(original).Append(visited));
    }

    public override SyntaxNode VisitIfStatement(IfStatementSyntax node) =>
        node.WithCondition((ExpressionSyntax)Visit(node.Condition)).WithStatement(Embedded(node.Statement)).WithElse(node.Else == null ? null : (ElseClauseSyntax)Visit(node.Else));

    public override SyntaxNode VisitElseClause(ElseClauseSyntax node) =>
        node.Statement is IfStatementSyntax ? base.VisitElseClause(node) : node.WithStatement(Embedded(node.Statement));

    public override SyntaxNode VisitWhileStatement(WhileStatementSyntax node) => ((WhileStatementSyntax)base.VisitWhileStatement(node)).WithStatement(Embedded(node.Statement));
    public override SyntaxNode VisitDoStatement(DoStatementSyntax node) => ((DoStatementSyntax)base.VisitDoStatement(node)).WithStatement(Embedded(node.Statement));
    public override SyntaxNode VisitForStatement(ForStatementSyntax node) => ((ForStatementSyntax)base.VisitForStatement(node)).WithStatement(Embedded(node.Statement));
    public override SyntaxNode VisitForEachStatement(ForEachStatementSyntax node) => ((ForEachStatementSyntax)base.VisitForEachStatement(node)).WithStatement(Embedded(node.Statement));
    public override SyntaxNode VisitUsingStatement(UsingStatementSyntax node) => ((UsingStatementSyntax)base.VisitUsingStatement(node)).WithStatement(Embedded(node.Statement));
    public override SyntaxNode VisitLockStatement(LockStatementSyntax node) => ((LockStatementSyntax)base.VisitLockStatement(node)).WithStatement(Embedded(node.Statement));

    public override SyntaxNode VisitMethodDeclaration(MethodDeclarationSyntax node)
    {
        var visited = (MethodDeclarationSyntax)base.VisitMethodDeclaration(node);
        string name = node.Identifier.ValueText;
        if (visited.Body != null) return visited.WithBody(Frame(name, visited.Body));
        if (visited.ExpressionBody != null)
        {
            // => 식 본문은 블록으로 바꿔 한 줄 기록한다 (줄 번호는 식이 있는 줄)
            bool isVoid = node.ReturnType is PredefinedTypeSyntax p && p.Keyword.IsKind(SyntaxKind.VoidKeyword);
            var expr = visited.ExpressionBody.Expression;
            StatementSyntax stmt = isVoid ? ExpressionStatement(expr) : ReturnStatement(expr);
            var line = ParseStatement($"__T.L({Line(node.ExpressionBody.Expression)}{ParamArgs(node.ParameterList, node.Modifiers.Any(SyntaxKind.StaticKeyword) || node.Parent is not TypeDeclarationSyntax)});");
            return visited.WithExpressionBody(null).WithSemicolonToken(default).WithBody(Frame(name, Block(line, stmt)));
        }
        return visited;
    }

    static string ParamArgs(ParameterListSyntax ps, bool isStatic)
    {
        var sb = new StringBuilder();
        foreach (var p in ps.Parameters)
            if (!p.Modifiers.Any(SyntaxKind.OutKeyword)) sb.Append($", __T.{(IsRefParam(p) ? "VR" : "V")}({SymbolDisplay.FormatLiteral(p.Identifier.ValueText, true)}, {p.Identifier.Text})");
        if (!isStatic) sb.Append(", __T.V(\"this\", this)");
        return sb.ToString();
    }

    public override SyntaxNode VisitConstructorDeclaration(ConstructorDeclarationSyntax node)
    {
        var visited = (ConstructorDeclarationSyntax)base.VisitConstructorDeclaration(node);
        return visited.Body == null ? visited : visited.WithBody(Frame(node.Identifier.ValueText + " 생성자", visited.Body));
    }

    public override SyntaxNode VisitLocalFunctionStatement(LocalFunctionStatementSyntax node)
    {
        var visited = (LocalFunctionStatementSyntax)base.VisitLocalFunctionStatement(node);
        return visited.Body == null ? visited : visited.WithBody(Frame(node.Identifier.ValueText, visited.Body));
    }
}
