# styles/globals.css 에 넣을 내용

아래 블록을 globals.css 맨 위에 넣는다. Genie Lamp의 메인 컬러와 폰트는 제품 슬롯 값으로 설정한다.

파일 위치:
- 폰트 `public/fonts/`: Pretendard-Regular, Medium, SemiBold (.woff2)
- 마법사 모자 오브제: 정사각형 투명 SVG 또는 `public/images/` 이미지

```css
@font-face { font-family: "Pretendard"; src: url("/fonts/Pretendard-Regular.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Pretendard"; src: url("/fonts/Pretendard-Medium.woff2") format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Pretendard"; src: url("/fonts/Pretendard-SemiBold.woff2") format("woff2"); font-weight: 600; font-display: swap; }

:root {
  --brand: #AF1276;
  --on-brand: #ffffff;
  --font-sans: Pretendard, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  --font-display: var(--font-sans);

  --surface: #000000;
  --ink: #eef0f3;
  --ink-muted: #9a9ea7;
  --line: #2a2d33;
  --off: #5d6169;
  --object-glow: var(--brand);
  --status-on: #4cc38a;
  --danger: #f97066;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px;
  color-scheme: dark;
}

body { margin: 0; background: var(--surface); color: var(--ink); font-family: var(--font-sans); }
:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
button { border: 0; border-radius: 0; }

/* 타입: 자간, 행간 지정 없음 */
.t-display { font-family: var(--font-display); font-size: 40px; font-weight: 600; }
.t-value { font-family: var(--font-display); font-size: 48px; font-weight: 600; font-variant-numeric: tabular-nums; }
.t-body    { font-size: 16px; font-weight: 400; }
.t-label   { font-size: 14px; font-weight: 500; }
.t-caption { font-size: 12px; font-weight: 400; }
@media (max-width: 767px) { .t-display { font-size: 24px; } }

/* 센서 마법사 모자 */
.wizard-hat { --level: 0; width: min(72vw, 360px); aspect-ratio: 1; margin: 0 auto; animation: hat-float 6s ease-in-out infinite alternate; color: var(--brand); }
.wizard-hat svg { display: block; width: 100%; height: 100%; }
.hat-brim, .hat-crown { fill: currentColor; }
.hat-light { fill: var(--on-brand); opacity: var(--level); }
.hat-band, .hat-buckle { fill: var(--surface); }
.wizard-hat[data-power="off"] { filter: brightness(0.22) grayscale(1); }
.wizard-hat[data-power="on"] { filter: brightness(calc(0.45 + 0.55 * var(--level))) drop-shadow(0 0 calc(var(--level) * 48px) var(--object-glow)); }
@keyframes hat-float { from { transform: translateY(0); } to { transform: translateY(-10px); } }
@media (prefers-reduced-motion: reduce) { .wizard-hat { animation: none; } }
```
