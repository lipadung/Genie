# WizardHat

검은 바탕 정가운데에 떠 있는 마법사 모자. 센서값에 따라 모자 내부 밝기와 주변 빛이 바뀐다. 실제 조명의 디지털 쌍둥이.

- 마법사 모자 모양의 정사각형 투명 오브제. SVG 또는 `public/images/`의 이미지로 표현한다.
- 위치: 화면 정가운데. 감싸는 `<section aria-label="마법사 모자 상태">`는 min-height 70vh, flex 세로 정렬로 가로 세로 가운데. 소제목 없음
- level = clamp((value − SENSOR_MIN) / (SENSOR_MAX − SENSOR_MIN), 0, 1) → 오브제의 `--level` 스타일 변수
- 센서값에 따라 모자 내부 밝기와 빛 drop-shadow level × 48px `--object-glow`를 조절한다.
- 전원 OFF: `data-power="off"` → 밝기 0.12, 흑백, 빛 없음
- 위아래 10px, 6초 주기로 천천히 떠 있음. reduced-motion이면 멈춤
- 모자 아래 space-6 간격으로 현재값 `t-value` (천 단위 콤마, 값 없으면 "—")
- `role="img"`, `aria-label="마법사 모자 밝기 NN%"`, 꺼지면 "마법사 모자 꺼짐"
- 응용: 같은 규격(정사각, 투명 배경) 이미지로 바꾸면 자기 제품 오브제로 쓸 수 있다
