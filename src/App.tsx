import { useMemo, useState } from "react"

type ActivityKey = "movie" | "museum" | "art" | "entertainment" | "theater" | "concert" | "traditional" | "dance"

type Row = {
  group: string
  label: string
  sample: number
  values: Record<ActivityKey, number | null>
}

const activities: {
  key: ActivityKey
  label: string
  short: string
  color: string
}[] = [
  { key: "movie", label: "영화관람", short: "영화", color: "#3d63e7" },
  { key: "museum", label: "박물관 관람", short: "박물관", color: "#5f7bea" },
  { key: "art", label: "미술관 관람", short: "미술관", color: "#748deb" },
  {
    key: "entertainment",
    label: "연예공연 관람",
    short: "연예공연",
    color: "#43a28c",
  },
  { key: "theater", label: "연극공연 관람", short: "연극", color: "#e17b55" },
  {
    key: "concert",
    label: "음악연주회 관람",
    short: "음악회",
    color: "#d8a23c",
  },
  {
    key: "traditional",
    label: "전통예술공연 관람",
    short: "전통예술",
    color: "#a279ca",
  },
  { key: "dance", label: "무용공연 관람", short: "무용", color: "#dd7397" },
]

const rawRows: [string, string, number, ...Array<number | null>][] = [
  ["전체", "소계", 10028, 45, 7.7, 8.1, 8.5, 6.4, 3.4, 2, 1],
  ["성별", "남성", 4919, 45, 6.3, 6.2, 7.1, 4.7, 2.7, 1.9, 0.6],
  ["성별", "여성", 5109, 45, 9, 10, 9.9, 8.1, 4.1, 2.2, 1.4],
  ["연령별", "15~19세", 465, 67.8, 11.2, 10.3, 13, 6.9, 2.3, 1.2, 0.5],
  ["연령별", "20대", 1266, 75.2, 7.7, 13.9, 12.6, 12.5, 4.3, 1.1, 2],
  ["연령별", "30대", 1496, 62.6, 11.8, 12.7, 12.6, 10.5, 3.9, 1, 0.8],
  ["연령별", "40대", 1694, 54.3, 12, 11.3, 8.8, 9.4, 3.5, 2, 1],
  ["연령별", "50대", 1883, 42.7, 6.4, 6, 7.1, 4.7, 4, 2.2, 1.1],
  ["연령별", "60대", 1759, 23.3, 4.9, 3.7, 6.8, 1.8, 2.9, 2.8, 0.9],
  ["연령별", "70세이상", 1465, 9.9, 2, 1.6, 2.7, 0.7, 2, 3.2, 0.7],
  ["학력별", "초졸 이하", 802, 10.9, 1.8, 1.9, 1.8, 0.9, 1.4, 1, null],
  ["학력별", "중졸", 976, 30.4, 5.8, 4, 6.8, 2.7, 1.3, 1.9, 0.3],
  ["학력별", "고졸", 3593, 38.4, 4.8, 4.5, 6.8, 3.5, 2.6, 2.1, 0.8],
  ["학력별", "대졸이상", 4657, 57.4, 10.9, 12.5, 11, 10, 4.7, 2.1, 1.5],
  ["동거가구원수별", "1인", 2003, 34.3, 3.7, 6.5, 8.2, 4.8, 2.2, 1.5, 1.3],
  ["동거가구원수별", "2인", 3226, 29.8, 4.8, 4.8, 6.3, 3.9, 2.8, 2.9, 0.7],
  ["동거가구원수별", "3인이상", 4799, 54.5, 9.8, 10.1, 9.7, 7.9, 3.8, 1.7, 1.1],
  ["혼인상태별", "미혼", 2772, 68.4, 7.7, 11.6, 12.4, 9.5, 3.4, 0.9, 1.2],
  ["혼인상태별", "기혼", 6038, 38.7, 8.2, 7.3, 7.3, 5.8, 3.6, 2.4, 1],
  ["혼인상태별", "사별/이혼/기타", 1218, 18.7, 3.1, 2.7, 5.6, 1, 1.8, 2.1, 0.9],
  ["종사자지위별", "상용근로자", 3747, 57.4, 9.1, 11, 10.4, 9.6, 4.3, 1.9, 1.3],
  ["종사자지위별", "임시근로자", 738, 34.2, 7.4, 5.4, 5.2, 3.8, 2.8, 3, 0.4],
  ["종사자지위별", "일용근로자", 214, 41.3, 4, 3.1, 11.8, 1.7, 2, 0.9, 0.9],
  [
    "종사자지위별",
    "고용원이 있는 자영업자",
    341,
    42.9,
    8.8,
    9,
    8.7,
    7.1,
    6,
    2.2,
    2.2,
  ],
  [
    "종사자지위별",
    "고용원이 없는 자영업자",
    1343,
    34.4,
    4.4,
    4.4,
    5.7,
    2.8,
    2.3,
    2,
    1,
  ],
  [
    "종사자지위별",
    "무급가족종사자",
    158,
    18.1,
    2.6,
    2.8,
    2.8,
    2.7,
    0.8,
    2.1,
    1.1,
  ],
  ["종사자지위별", "전업주부", 1838, 29.1, 8, 6.5, 7.6, 4.9, 3, 2.4, 0.7],
  ["종사자지위별", "학생", 761, 71.1, 9.5, 11.5, 12.7, 8.3, 2.6, 1, 0.8],
  [
    "종사자지위별",
    "해당없음(무직)",
    888,
    25.2,
    4.7,
    3.8,
    4.2,
    1.5,
    2.7,
    2.1,
    0.5,
  ],
  ["가구소득별", "100만원 미만", 819, 22, 3.9, 3.7, 5.5, 1.4, 1.3, 1.9, 0.9],
  ["가구소득별", "100~200만원", 616, 12.9, 2.5, 2.5, 3.5, 1.8, 1.5, 2.3, 0.7],
  ["가구소득별", "200~300만원", 1134, 24.6, 3.6, 4.6, 5.3, 3, 2.3, 2.9, 0.8],
  ["가구소득별", "300~400만원", 1543, 35.6, 5.8, 6.3, 7.1, 4.2, 2, 1.6, 0.8],
  ["가구소득별", "400~500만원", 1291, 41.2, 7.4, 5.7, 6.9, 4.7, 2.1, 2.2, 0.7],
  ["가구소득별", "500~600만원", 1591, 52, 7, 7.3, 9.1, 6.4, 3.4, 2.1, 1],
  [
    "가구소득별",
    "600만원 이상",
    3034,
    58.7,
    10.9,
    12.2,
    11.2,
    9.9,
    5.1,
    1.8,
    1.3,
  ],
  ["지역규모별", "대도시", 4538, 49.5, 8.8, 9.2, 9.7, 6.6, 3.6, 1.9, 1],
  ["지역규모별", "중소도시", 3368, 45, 7, 8.3, 7.6, 6.7, 3.5, 1.6, 1],
  ["지역규모별", "읍면지역", 2122, 33.4, 6.3, 4.9, 7.7, 5.2, 2.7, 3.2, 1.2],
  ["17개 시도별", "서울", 1160, 53, 9, 9.5, 9.9, 8.3, 3.9, 2.5, 1.2],
  ["17개 시도별", "부산", 699, 48.9, 9.3, 11.6, 15.2, 5, 2.7, 1.8, 0.5],
  ["17개 시도별", "대구", 586, 43, 6.3, 6.1, 6.8, 4.4, 2.9, 0.4, 0.2],
  ["17개 시도별", "인천", 628, 49, 11.9, 9.9, 5.7, 6.5, 3.9, 1.7, 0.5],
  ["17개 시도별", "광주", 452, 43.6, 7.1, 6.5, 6, 3.1, 3.1, 2, 0.4],
  ["17개 시도별", "대전", 460, 52.3, 7, 10.3, 12.7, 7.6, 5.3, 2.6, 4.1],
  ["17개 시도별", "울산", 381, 42.7, 7.6, 5, 9.4, 4.7, 2, 0.4, 0.6],
  ["17개 시도별", "세종", 233, 37.8, 7.2, 9.9, 5, 3.5, 3.8, 0.9, 1.7],
  ["17개 시도별", "경기", 1337, 45.4, 7, 9, 8.3, 7.9, 3.8, 1.4, 1.1],
  ["17개 시도별", "강원", 468, 34.9, 5.9, 6.3, 7, 7.4, 3.8, 0.9, 0.1],
  ["17개 시도별", "충북", 478, 33.6, 6.5, 6.7, 7.3, 7.8, 3.9, 5.9, 4],
  ["17개 시도별", "충남", 550, 48.8, 9.4, 4.6, 8.2, 4.6, 3, 2.6, 0.7],
  ["17개 시도별", "전북", 504, 48.8, 8.3, 5.6, 9.4, 4.9, 1.7, 3.7, 0.8],
  ["17개 시도별", "전남", 511, 33.9, 3.7, 3.2, 4.6, 1.6, 0.7, 1.7, 0.7],
  ["17개 시도별", "경북", 607, 32.6, 3.9, 4.4, 6.2, 4, 3, 2.8, 0.4],
  ["17개 시도별", "경남", 674, 40.6, 8.4, 8.8, 8.4, 4.9, 3.1, 2, 0.9],
  ["17개 시도별", "제주", 300, 16.5, 4.3, 3.4, 1, 2.3, 2.6, 2, 0.4],
  ["장애여부별", "장애등록", 145, 14.2, 3.1, null, 3.2, 0.9, 1.4, 0.8, 0.8],
  ["장애여부별", "미등록", 116, 22.7, 9.7, 6, 8.5, 6.6, 3.4, 7.3, 1.6],
  ["장애여부별", "해당사항없음", 9767, 45.6, 7.7, 8.2, 8.6, 6.5, 3.4, 2, 1],
  ["근무 형태", "전일제", 4201, 52.3, 8.3, 9.7, 9.8, 8.5, 3.8, 1.9, 1.4],
  ["근무 형태", "교대제", 313, 47.4, 8.3, 9.8, 15, 6.2, 4.9, 3.3, 0.5],
  ["근무 형태", "시간 선택제", 443, 34.8, 7.6, 5.3, 7.9, 2.2, 2.4, 1.4, 1.2],
  ["근무 형태", "해당 없음", 1584, 39.6, 5.5, 5.8, 4.5, 4.3, 3.5, 2.2, 0.7],
  ["유연 근무제 여부", "시행", 543, 53.1, 10.7, 12.2, 13.9, 13.6, 5, 2.3, 1.8],
  ["유연 근무제 여부", "미시행", 3125, 50.5, 7.6, 8.9, 9.4, 6.9, 2.9, 1.4, 1.1],
  [
    "유연 근무제 여부",
    "해당 없음",
    2873,
    44.3,
    7,
    7.3,
    6.7,
    6.1,
    4.4,
    2.7,
    1.2,
  ],
]

const rows: Row[] = rawRows.map(([group, label, sample, ...values]) => ({
  group,
  label,
  sample,
  values: Object.fromEntries(
    activities.map((activity, index) => [activity.key, values[index]]),
  ) as Record<ActivityKey, number | null>,
}))

const groups = [...new Set(rows.map((row) => row.group))].filter(
  (group) => group !== "전체",
)
const overall = rows[0]

function formatValue(value: number | null) {
  return value === null ? "–" : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5.5 7.5 4.5 4.5 4.5-4.5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15.5h12" />
    </svg>
  )
}

function App() {
  const [selectedGroup, setSelectedGroup] = useState("연령별")
  const [selectedActivity, setSelectedActivity] = useState<ActivityKey>("movie")
  const [sortHigh, setSortHigh] = useState(true)

  const activeActivity = activities.find(
    (activity) => activity.key === selectedActivity,
  )!
  const groupRows = useMemo(
    () => rows.filter((row) => row.group === selectedGroup),
    [selectedGroup],
  )
  const selectedRows = useMemo(() => {
    return [...groupRows].sort((a, b) => {
      const av = a.values[selectedActivity] ?? -1
      const bv = b.values[selectedActivity] ?? -1
      return sortHigh ? bv - av : av - bv
    })
  }, [groupRows, selectedActivity, sortHigh])

  const chartMax = Math.max(
    10,
    ...selectedRows.map((row) => row.values[selectedActivity] ?? 0),
  )
  const topRow = [...groupRows]
    .filter((row) => row.values[selectedActivity] !== null)
    .sort(
      (a, b) =>
        (b.values[selectedActivity] ?? -1) - (a.values[selectedActivity] ?? -1),
    )[0]
  const overallValue = overall.values[selectedActivity] ?? 0
  const gap =
    topRow?.values[selectedActivity] == null
      ? 0
      : topRow.values[selectedActivity] - overallValue

  const downloadCsv = () => {
    const header = [
      "분류",
      "항목",
      "표본수",
      ...activities.map((activity) => activity.label),
    ]
    const body = rows.map((row) => [
      row.group,
      row.label,
      row.sample,
      ...activities.map((activity) => row.values[activity.key] ?? "-"),
    ])
    const csv = [header, ...body].map((line) => line.join(",")).join("\n")
    const link = document.createElement("a")
    link.href = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    )
    link.download = "문화여가_참여율_2025.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="문화여가 데이터랩 홈">
          <BrandMark />
          <span>문화여가 데이터랩</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a className="active" href="#overview">
            전체 현황
          </a>
          <a href="#compare">분류별 비교</a>
          <a href="#table">데이터 표</a>
        </nav>
        <button className="download-button" type="button" onClick={downloadCsv}>
          <DownloadIcon />
          데이터 내려받기
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>국가통계</span>
              2025 문화여가 활동 조사
            </div>
            <h1>
              지난 1년, 우리는
              <br />
              어떤 문화를 즐겼을까요?
            </h1>
            <p>
              영화부터 공연예술까지, 국민의 문화여가 참여 모습을
              <br className="desktop-only" /> 인구·사회 특성별로 한눈에
              살펴보세요.
            </p>
          </div>
          <div className="hero-meta">
            <div>
              <span>조사 표본</span>
              <strong>10,028</strong>
              <small>명</small>
            </div>
            <div>
              <span>활동 유형</span>
              <strong>8</strong>
              <small>개</small>
            </div>
            <div>
              <span>분석 분류</span>
              <strong>13</strong>
              <small>개</small>
            </div>
          </div>
        </section>

        <section className="section" id="overview">
          <div className="section-heading">
            <div>
              <span className="section-number">01</span>
              <h2>전체 참여 현황</h2>
            </div>
            <p>각 활동별 지난 1년 내 1회 이상 참여한 사람의 비율</p>
          </div>

          <div className="overview-grid">
            <article className="panel overview-chart">
              <div className="panel-header">
                <div>
                  <span className="label">전국 전체</span>
                  <h3>문화여가 활동 참여율</h3>
                </div>
                <span className="unit">단위: %</span>
              </div>
              <div className="activity-bars">
                {activities.map((activity, index) => {
                  const value = overall.values[activity.key] ?? 0
                  return (
                    <div className="activity-row" key={activity.key}>
                      <span className="rank">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="activity-name">{activity.label}</span>
                      <div className="bar-track">
                        <i
                          className="bar-fill"
                          style={{
                            width: `${(value / 50) * 100}%`,
                            background: activity.color,
                          }}
                        />
                      </div>
                      <strong>{formatValue(value)}</strong>
                    </div>
                  )
                })}
              </div>
            </article>

            <aside className="insight-card">
              <div className="insight-kicker">KEY INSIGHT</div>
              <div className="insight-figure">
                <strong>45.0</strong>
                <span>%</span>
              </div>
              <h3>2명 중 1명은 영화를 봤어요</h3>
              <p>
                영화관람은 다른 문화활동보다 참여율이 5배 이상 높아 가장
                보편적인 여가 문화로 나타났습니다.
              </p>
              <div className="insight-divider" />
              <dl>
                <div>
                  <dt>두 번째로 높은 활동</dt>
                  <dd>연예공연 8.5%</dd>
                </div>
                <div>
                  <dt>가장 낮은 활동</dt>
                  <dd>무용공연 1.0%</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="section compare-section" id="compare">
          <div className="section-heading">
            <div>
              <span className="section-number">02</span>
              <h2>분류별 참여 비교</h2>
            </div>
            <p>분류와 활동을 선택해 집단 간 참여율 격차를 확인하세요</p>
          </div>

          <div className="filter-panel">
            <div className="filter-label">분석 기준</div>
            <div className="group-tabs">
              {groups.map((group) => (
                <button
                  className={selectedGroup === group ? "selected" : ""}
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  type="button"
                >
                  {group.replace("별", "")}
                </button>
              ))}
            </div>
            <div className="activity-filter">
              <label htmlFor="activity-select">활동 유형</label>
              <div className="select-wrap">
                <select
                  id="activity-select"
                  value={selectedActivity}
                  onChange={(event) =>
                    setSelectedActivity(event.target.value as ActivityKey)
                  }
                >
                  {activities.map((activity) => (
                    <option key={activity.key} value={activity.key}>
                      {activity.label}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>

          <div className="compare-grid">
            <article className="panel ranking-chart">
              <div className="panel-header">
                <div>
                  <span className="label">{selectedGroup}</span>
                  <h3>{activeActivity.label} 참여율</h3>
                </div>
                <button
                  className="sort-button"
                  type="button"
                  onClick={() => setSortHigh((value) => !value)}
                >
                  {sortHigh ? "높은 순" : "낮은 순"}
                  <ChevronIcon />
                </button>
              </div>
              <div className="chart-area">
                <div
                  className="average-line"
                  style={{
                    left: `calc(152px + ${(overallValue / chartMax) * 72}%)`,
                  }}
                >
                  <span>전체 {formatValue(overallValue)}</span>
                </div>
                {selectedRows.map((row, index) => {
                  const value = row.values[selectedActivity]
                  return (
                    <div className="ranking-row" key={row.label}>
                      <div className="ranking-label">
                        <span>{index + 1}</span>
                        <strong>{row.label}</strong>
                      </div>
                      <div className="ranking-track">
                        <i
                          style={{
                            width:
                              value === null
                                ? "0%"
                                : `${(value / chartMax) * 100}%`,
                            background:
                              index === 0
                                ? activeActivity.color
                                : `${activeActivity.color}b3`,
                          }}
                        />
                      </div>
                      <b>{formatValue(value)}</b>
                    </div>
                  )
                })}
              </div>
            </article>

            <aside className="panel compare-insight">
              <div className="mini-label">가장 높은 집단</div>
              <h3>{topRow?.label ?? "자료 없음"}</h3>
              <div className="compare-number">
                {formatValue(topRow?.values[selectedActivity] ?? null)}
              </div>
              <div className={`gap-pill ${gap >= 0 ? "positive" : ""}`}>
                전체보다 {gap >= 0 ? "+" : ""}
                {gap.toFixed(1)}%p
              </div>
              <div className="mini-chart">
                <span>전체</span>
                <div>
                  <i
                    style={{
                      width: `${(overallValue / Math.max(overallValue, topRow?.values[selectedActivity] ?? 0)) * 100}%`,
                    }}
                  />
                </div>
                <b>{formatValue(overallValue)}</b>
                <span>{topRow?.label}</span>
                <div>
                  <i
                    className="accent"
                    style={{
                      width: `${((topRow?.values[selectedActivity] ?? 0) / Math.max(overallValue, topRow?.values[selectedActivity] ?? 0)) * 100}%`,
                    }}
                  />
                </div>
                <b>{formatValue(topRow?.values[selectedActivity] ?? null)}</b>
              </div>
              <p>
                현재 선택한 <strong>{activeActivity.short}</strong> 활동에서
                가장 높은 참여율을 보인 집단입니다.
              </p>
            </aside>
          </div>
        </section>

        <section className="section" id="table">
          <div className="section-heading table-heading">
            <div>
              <span className="section-number">03</span>
              <h2>상세 데이터</h2>
            </div>
            <p>선택한 분류의 8개 문화여가 활동을 함께 비교합니다</p>
          </div>

          <article className="panel data-panel">
            <div className="data-toolbar">
              <div>
                <span className="label">현재 분류</span>
                <h3>{selectedGroup}</h3>
              </div>
              <span>표본수와 참여율(%)</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>표본수</th>
                    {activities.map((activity) => (
                      <th key={activity.key}>{activity.short}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows
                    .filter((row) => row.group === selectedGroup)
                    .map((row) => (
                      <tr key={row.label}>
                        <th>{row.label}</th>
                        <td>{row.sample.toLocaleString()}</td>
                        {activities.map((activity) => (
                          <td
                            className={
                              activity.key === selectedActivity
                                ? "highlight"
                                : ""
                            }
                            key={activity.key}
                          >
                            {formatValue(row.values[activity.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="data-note">
              <span>i</span>
              ‘–’는 해당 항목의 표본 자료가 없음을 의미합니다. 모든 수치는
              소수점 첫째 자리에서 반올림해 표시합니다.
            </div>
          </article>
        </section>
      </main>

      <footer>
        <div>
          <BrandMark />
          <strong>문화여가 데이터랩</strong>
        </div>
        <p>출처: KOSIS 국가통계포털 · 2025 문화여가 활동 조사</p>
        <span>시각화 초안 · 2025</span>
      </footer>
    </div>
  )
}

export default App
