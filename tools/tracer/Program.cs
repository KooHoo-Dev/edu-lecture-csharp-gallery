// 기록 도구(트레이서). tools/trace.mjs 가 부른다. 표준 입력으로 요청 JSON 을 받고, 표준 출력으로 기록 JSON 을 낸다.
//   요청: { "file": "samples/<id>/X.cs", "source": "...", "runs": [ { "key": "...", "mistake": false, "values": { "count": "3" } } ] }
//   결과: { "runs": { "<key>": { "normal": 기록, "mistake": 기록 } }, "errors": [ ... ] }
// 하는 일 (원본 파일은 건드리지 않는다):
//   1. // @param <key> 가 붙은 선언의 초기값을 values 로 바꾼다 (줄 수는 그대로)
//   2. 메서드·생성자·로컬 함수의 본문 문장마다 앞에 __T.L(원래 줄, 보이는 변수...) 을 끼우고, 본문을 __T.Enter / Exit 로 감싼다
//   3. C# 9 로 컴파일해 메모리에서 실행하고 런타임(Runtime.cs)이 모은 기록을 받는다
// 한계: 선언할 때 초기화하지 않은 지역 변수, 속성 접근자·람다 안 문장, out 매개변수는 기록하지 않는다 (docs/specimen-guide.md).
// ref · in 매개변수는 부른 쪽 변수(지역 변수, 매개변수, 정적 필드)와 잇는다. 부르는 문장 앞에서 __T.RefArg 로 남기고 Enter 가 가져간다.
// 교안처럼 최상위 문(클래스·Main 없이)으로 쓴 원본도 기록한다 (프레임 이름 Main). using System; 이 없으면 1번 줄 앞에 붙여 컴파일한다 (줄 수 그대로).
// 선언만 하고 값이 확실히 정해지지 않은 지역 변수는 '값 없음' (__T.U) 으로 남긴다 (Roslyn 확정 할당 분석).
// 요청의 run.stdin 은 Console.ReadLine 이 읽는 입력이다. 읽은 줄은 콘솔 출력에 그대로 찍힌다 (사람이 친 것처럼).
// 효과 끄기(GALLERY_MISTAKE) 실행이 컴파일되지 않으면 오류 줄과 메시지를 기록으로 남긴다 (교안의 '❌ 상황' 이 컴파일 오류인 경우).
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Globalization;
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
    string stdin = (string)run["stdin"] ?? "";
    var (trace, error) = Tracer.Run(file, source, mistake, values, stdin);
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

    static readonly Regex UsingSystem = new(@"^\s*using\s+System\s*;", RegexOptions.Multiline);

    public static (JsonNode trace, string error) Run(string file, string source, bool mistake, Dictionary<string, string> values, string stdin)
    {
        // 교안 코드처럼 using System; 없이 쓴 원본: 1번 줄 앞에 붙인다 (줄 번호가 그대로다)
        if (!UsingSystem.IsMatch(source)) source = "using System; " + source;
        var options = Parse9.WithPreprocessorSymbols(mistake ? new[] { "GALLERY_MISTAKE" } : Array.Empty<string>());
        var original = CSharpSyntaxTree.ParseText(source, options, file);
        var (withValues, missing) = ApplyParams(original, values);
        if (missing.Count > 0) return (null, $"// @param 이 붙은 선언을 찾지 못한 값: {string.Join(", ", missing)}");
        var tree = CSharpSyntaxTree.ParseText(withValues, options, file);

        // 원본 그대로 먼저 컴파일해 본다 (표본 자체의 오류는 원래 줄 번호로 알린다)
        var plain = Compile(new[] { tree });
        var plainErrors = plain.GetDiagnostics().Where(d => d.Severity == DiagnosticSeverity.Error).ToList();
        if (plainErrors.Count > 0)
        {
            // 효과 끄기가 컴파일 오류인 실수(교안의 CS0165 등)면 그 줄과 메시지를 기록으로 남긴다. 보통 실행은 오류다
            if (mistake) return (CompileErrorTrace(plainErrors), null);
            return (null, "컴파일 오류\n" + string.Join("\n", plainErrors.Take(10).Select(d => d.ToString())));
        }

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
            t.GetMethod("Begin")!.Invoke(null, new object[] { stdin });
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

    /// 컴파일 오류 기록: 칸 하나 (끝), 오류 줄들, 메시지 (영어. 교안이 영어 메시지를 싣는다)
    static JsonNode CompileErrorTrace(List<Diagnostic> errors)
    {
        int LineOf(Diagnostic d) => d.Location.GetLineSpan().StartLinePosition.Line + 1;
        var shown = errors.Take(5).ToList();
        string message = string.Join("\n", shown.Select(d => $"{LineOf(d)}번 줄 · {d.Id}: {d.GetMessage(CultureInfo.InvariantCulture)}"));
        var bad = new JsonArray(shown.Select(LineOf).Distinct().Select(n => (JsonNode)n).ToArray());
        var step = new JsonObject { ["line"] = LineOf(shown[0]), ["frames"] = new JsonArray(), ["heap"] = new JsonArray(), ["end"] = true, ["error"] = message, ["bad"] = bad };
        return new JsonObject { ["steps"] = new JsonArray(step), ["error"] = message, ["compile"] = true };
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
            if (p is MethodDeclarationSyntax or ConstructorDeclarationSyntax or LocalFunctionStatementSyntax or GlobalStatementSyntax) return true;
            if (p is MemberDeclarationSyntax) return false;
        }
        return false;
    }

    /// 이 문장을 둘러싼 함수 (메서드, 생성자, 로컬 함수, 람다, 접근자, 최상위 문이면 파일)
    static SyntaxNode EnclosingFunction(SyntaxNode n) =>
        n.Ancestors().FirstOrDefault(a => a is BaseMethodDeclarationSyntax or LocalFunctionStatementSyntax or AnonymousFunctionExpressionSyntax or AccessorDeclarationSyntax or CompilationUnitSyntax);

    enum Kind { Value, Ref, Unassigned }

    /// 이 문장 앞에서 보이는 이름들: this, 매개변수(out 제외), 같은 함수 안에서 앞서 선언한 지역 변수 (선언 순서).
    /// 지역 변수는 Roslyn 확정 할당 분석으로 값이 확실히 정해졌는지 보고, 아니면 '값 없음' 으로 남긴다 (읽으면 CS0165 라 값을 넘길 수 없다)
    List<(string code, string label, Kind kind, string type)> Visible(StatementSyntax s)
    {
        var names = new List<(string, string, Kind, string)>();
        var func = EnclosingFunction(s);
        ParameterListSyntax ps = func switch
        {
            BaseMethodDeclarationSyntax m => m.ParameterList,
            LocalFunctionStatementSyntax lf => lf.ParameterList,
            _ => null,
        };
        if (ps != null)
        {
            bool isStatic = func is BaseMethodDeclarationSyntax bm ? bm.Modifiers.Any(SyntaxKind.StaticKeyword) : ((LocalFunctionStatementSyntax)func).Modifiers.Any(SyntaxKind.StaticKeyword);
            var type = func.Ancestors().OfType<TypeDeclarationSyntax>().FirstOrDefault();
            bool structCtor = func is ConstructorDeclarationSyntax && type is StructDeclarationSyntax;
            // 로컬 함수의 this 는 바깥 메서드를 따른다
            if (func is LocalFunctionStatementSyntax)
            {
                var outer = func.Ancestors().OfType<BaseMethodDeclarationSyntax>().FirstOrDefault();
                isStatic = isStatic || outer == null || outer.Modifiers.Any(SyntaxKind.StaticKeyword);
                structCtor = outer is ConstructorDeclarationSyntax && type is StructDeclarationSyntax;
            }
            if (!isStatic && !structCtor && type != null) names.Add(("this", "this", Kind.Value, ""));
            foreach (var p in ps.Parameters)
                if (!p.Modifiers.Any(SyntaxKind.OutKeyword)) names.Add((p.Identifier.Text, p.Identifier.ValueText, IsRefParam(p) ? Kind.Ref : Kind.Value, ""));
        }

        System.Collections.Immutable.ImmutableArray<ISymbol>? assigned = null;
        try
        {
            var flow = model.AnalyzeDataFlow(s);
            if (flow.Succeeded) assigned = flow.DefinitelyAssignedOnEntry;
        }
        catch (ArgumentException) { }
        var locals = model.LookupSymbols(s.SpanStart).OfType<ILocalSymbol>()
            .Where(l => !l.IsConst)
            .Select(l => (l, decl: l.DeclaringSyntaxReferences.FirstOrDefault()?.GetSyntax()))
            .Where(x => x.decl != null && x.decl.SpanStart < s.SpanStart && EnclosingFunction(x.decl) == func)
            .OrderBy(x => x.decl.SpanStart);
        foreach (var (l, decl) in locals)
        {
            bool ok = assigned?.Contains(l, SymbolEqualityComparer.Default) ?? !(decl is VariableDeclaratorSyntax v && v.Initializer == null);
            string code = SyntaxFacts.GetKeywordKind(l.Name) != SyntaxKind.None ? "@" + l.Name : l.Name;
            names.Add((code, l.Name, ok ? Kind.Value : Kind.Unassigned, l.Type.ToDisplayString(SymbolDisplayFormat.MinimallyQualifiedFormat)));
        }
        return names;
    }

    static bool IsRefParam(ParameterSyntax p) => p.Modifiers.Any(SyntaxKind.RefKeyword) || p.Modifiers.Any(SyntaxKind.InKeyword);

    /// 문장 앞에 끼우는 기록: __T.L(줄, 보이는 변수...) 과, 이 문장이 부르는 메서드의 ref 인자 (__T.RefArg)
    List<StatementSyntax> LineCall(StatementSyntax original)
    {
        var args = new List<ArgumentSyntax> { Argument(LiteralExpression(SyntaxKind.NumericLiteralExpression, Literal(Line(original)))) };
        foreach (var (code, label, kind, type) in Visible(original))
            args.Add(Argument(ParseExpression(kind == Kind.Unassigned
                ? $"__T.U({SymbolDisplay.FormatLiteral(label, true)}, {SymbolDisplay.FormatLiteral(type, true)})"
                : $"__T.{(kind == Kind.Ref ? "VR" : "V")}({SymbolDisplay.FormatLiteral(label, true)}, {code})")));
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

    /// 최상위 문: 첫 문장 앞에서 Main 프레임을 열고, 문장마다 기록을 끼운다 (프로그램이 끝나면 기록도 끝나므로 닫지 않는다)
    public override SyntaxNode VisitCompilationUnit(CompilationUnitSyntax node)
    {
        var members = new List<MemberDeclarationSyntax>();
        bool entered = false;
        int afterLast = -1;
        StatementSyntax last = null;
        foreach (var m in node.Members)
        {
            if (m is GlobalStatementSyntax gs)
            {
                if (!entered)
                {
                    members.Add(GlobalStatement(ParseStatement("__T.Enter(\"Main\");")));
                    entered = true;
                }
                var visited = (StatementSyntax)Visit(gs.Statement);
                if (Traceable(gs.Statement)) foreach (var c in LineCall(gs.Statement)) members.Add(GlobalStatement(c));
                members.Add(gs.WithStatement(visited));
                if (gs.Statement is not LocalFunctionStatementSyntax)
                {
                    last = gs.Statement;
                    afterLast = members.Count;
                }
            }
            else members.Add((MemberDeclarationSyntax)Visit(m));
        }
        // 마지막 문장을 실행한 뒤의 변수 상태 (프로그램 끝 칸이 빈 메모리가 아니라 마지막 상태를 보이게)
        if (last != null) members.Insert(afterLast, GlobalStatement(FinalCall(last)));
        return node.WithMembers(List(members));
    }

    /// 최상위 문의 마지막 문장 뒤: 그때 보이는 지역 변수를 __T.Final 로 남긴다 (확정 할당은 마지막 문장을 나온 뒤 기준)
    StatementSyntax FinalCall(StatementSyntax last)
    {
        System.Collections.Immutable.ImmutableArray<ISymbol>? assigned = null;
        try
        {
            var flow = model.AnalyzeDataFlow(last);
            if (flow.Succeeded) assigned = flow.DefinitelyAssignedOnExit;
        }
        catch (ArgumentException) { }
        var args = new List<string>();
        var locals = model.LookupSymbols(last.Span.End).OfType<ILocalSymbol>()
            .Where(l => !l.IsConst)
            .Select(l => (l, decl: l.DeclaringSyntaxReferences.FirstOrDefault()?.GetSyntax()))
            .Where(x => x.decl != null && x.decl.SpanStart < last.Span.End && EnclosingFunction(x.decl) is CompilationUnitSyntax)
            .OrderBy(x => x.decl.SpanStart);
        foreach (var (l, decl) in locals)
        {
            bool ok = assigned?.Contains(l, SymbolEqualityComparer.Default) ?? !(decl is VariableDeclaratorSyntax v && v.Initializer == null);
            string code = SyntaxFacts.GetKeywordKind(l.Name) != SyntaxKind.None ? "@" + l.Name : l.Name;
            args.Add(ok
                ? $"__T.V({SymbolDisplay.FormatLiteral(l.Name, true)}, {code})"
                : $"__T.U({SymbolDisplay.FormatLiteral(l.Name, true)}, {SymbolDisplay.FormatLiteral(l.Type.ToDisplayString(SymbolDisplayFormat.MinimallyQualifiedFormat), true)})");
        }
        return ParseStatement($"__T.Final({string.Join(", ", args)});");
    }

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
