# 인수인계 (새 세션이 처음 읽는 문서)

새 세션은 이 문서, `docs/plan.md`, `docs/specimen-guide.md` 순서로 읽는다. 공통 틀은 `node_modules/@koohoo/gallery-kit/docs/` (kit-guide, design).

## 상태 (2026-11-23)

- 뼈대 완료. 표본 1개(`value-vs-reference`, 기준 샘플 1), 제작 중 카드 15개. `gallery check` 통과, Unity 컴파일 통과.
- 로컬 `C:\Users\user\edu-lecture-csharp-gallery`, GitHub `KooHoo-Dev/edu-lecture-csharp-gallery` (main). Pages 소스를 GitHub Actions 로 바꿔야 배포된다 (plan.md 남은 일 1).
- 커밋과 push 는 Jay 가 허가한 리포에서만 한다. kit 리포(`C:\Users\user\edu-lecture-gallery-kit`)도 같다.

## 명령

```bash
npm install
npm run trace -- <id>                            # 실행 기록 (.NET SDK 10 필요. 원본이나 기록 도구를 고치면 다시)
npm run build
node tools/gallery.mjs check <id>                # 표본 검사 (kit 공통 + 도메인)
node tools/gallery.mjs check                     # 전체 (빌드, 용량, 오프라인, Skill 최신)
node tools/gallery.mjs live <id> --query="auto=0&step=2" wait:800 stage:step2
node tools/gallery.mjs thumbs <id>               # 썸네일 (무대 시간 4.3초)
node tools/gallery.mjs skill                     # Skill 다시 만들기 (check 가 최신 여부를 본다)
node tools/gallery.mjs unity-compile <id>        # Unity 내장 Roslyn 컴파일 (GALLERY_MISTAKE 꺼짐)
npm run kit:sync                                 # 로컬 kit 변경을 node_modules 에 복사 (확인용, 커밋 전 태그 설치로 되돌린다)
```

## 작업 흐름

- 표본 하나: `samples/<id>/<Name>.cs` → `src/specimens/<id>/meta.ts` → `npm run trace -- <id>` → `check <id>` → `live` 로 단계·효과 끄기 화면 확인 → `thumbs <id>` → `skill` → 전체 `check`.
- 원본을 고치면 기록부터 다시 만든다. 기록 지문은 원본과 기록 도구(Program.cs, Runtime.cs.txt) 둘 다에 걸려 있어, 기록 도구를 고치면 **모든 표본**의 기록을 다시 만들어야 한다 (`npm run trace`).
- 분업은 패턴 갤러리와 같다: 구독 세션이 기획, 무대, 기록 도구, 기준 샘플, 리뷰. 워커는 표본 폴더만 (plan.md 남은 일 6).

## 함정

- 기록 도구는 선언할 때 초기화하지 않은 지역 변수를 그리지 않는다 (specimen-guide 2절). 무대에 변수가 안 보이면 먼저 이것.
- 기록 도구는 콘솔 기본 인코딩이 아니라 UTF-8 로 stdin/stdout 을 쓴다. 직접 부를 때도 UTF-8 JSON 을 넘긴다.
- 무대의 코드 칸은 37줄이다. 긴 원본은 지금 줄을 따라 창이 움직인다.
- 썸네일 시간이 끝을 넘으면(표본이 7칸 미만) 이벤트 검사가 경고한다.
- kit 의 PowerShell·인코딩 함정은 kit-guide 8절.
