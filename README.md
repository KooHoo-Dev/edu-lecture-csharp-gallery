# C# Gallery

유니티 개발자 양성과정의 **C# 기초 갤러리**. 짧은 C# 프로그램을 실제로 실행한 기록을 한 줄씩 재생하며, 스택의 변수 상자와 힙의 객체, 둘을 잇는 참조 화살표가 어떻게 바뀌는지 본다. 효과 끄기로 흔한 실수를 넣은 실행과 비교한다.

- 원본 교안: [C# 기초](https://krkoohoo.github.io/01-csharp-basic/) (`krKooHoo/krKooHoo.github.io` 의 `docs/01-csharp-basic`)
- 기준: C# 9 (Unity 6.3 LTS 와 같은 언어 버전)
- 무대의 그림은 손으로 그리지 않는다. 기록 도구(`tools/tracer`, Roslyn)가 표본 C# 를 문장마다 기록 호출을 끼운 사본으로 실행해 남긴 기록(`truth/<id>/trace.json`)을 재생한다.
- 결과물은 HTML 파일 하나다. 더블클릭(file://)으로도, GitHub Pages 로도 같게 동작한다.

문서: [계획](docs/plan.md) · [인수인계](docs/handoff.md) · [표본 제작 가이드](docs/specimen-guide.md) · [표본 선정](docs/selection.md). 공통 틀은 [edu-lecture-gallery-kit](https://github.com/KooHoo-Dev/edu-lecture-gallery-kit).

```bash
npm install
npm run trace -- <id>      # 기록 만들기 (.NET SDK 10 필요)
npm run build
node tools/gallery.mjs check
```

## 라이선스

MIT. 모든 코드와 글은 학습용으로 새로 작성했다.
