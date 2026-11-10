import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { createClient } from "@supabase/supabase-js"
import { DEVICE_ID, MAX_POINTS, PRODUCT, SENSOR_MAX, SENSOR_MIN } from "./product"
import "./lamp-app.css"

type Reading = {
  value: number
  created_at: string
}

type Status = "disconnected" | "connecting" | "connected" | "error"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined
const demoMode =
  !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("<project>")
const db =
  !demoMode && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

const statusCopy: Record<Status, string> = {
  disconnected: "연결 안 됨",
  connecting: "연결 중…",
  connected: "연결됨",
  error: "연결 실패, 다시 시도",
}

function ProductHeader({ demoActive }: { demoActive: boolean }) {
  return (
    <header className="product-header">
      <h1 className="t-display">{PRODUCT.name || "[제품 이름]"}</h1>
      <p className="t-label product-concept">
        {PRODUCT.concept || "[제품 컨셉, 한 줄]"}
      </p>
      <p className="t-body product-description">
        {PRODUCT.description || "[제품 설명, 2~3문장]"}
      </p>
      {demoActive && (
        <p className="t-caption demo-caption">데모 데이터로 표시 중</p>
      )}
    </header>
  )
}

function WizardHat({
  value,
  power,
}: {
  value: number | undefined
  power: boolean
}) {
  const level =
    value === undefined
      ? 0
      : Math.min(1, Math.max(0, (value - SENSOR_MIN) / (SENSOR_MAX - SENSOR_MIN)))
  const brightness = Math.round(level * 100)

  return (
    <section className="object-section" aria-label="마법사 모자 상태">
      <div
        className="wizard-hat"
        data-power={power ? "on" : "off"}
        style={{ "--level": level } as CSSProperties}
        role="img"
        aria-label={
          power ? `마법사 모자 밝기 ${brightness}%` : "마법사 모자 꺼짐"
        }
      >
        <svg viewBox="0 0 360 360" aria-hidden="true">
          <path
            className="hat-brim"
            d="M49 264c19-32 78-52 145-49 61 2 113 22 124 48 7 17-28 32-87 37-66 6-145-2-176-19-12-7-14-12-6-17Z"
          />
          <path
            className="hat-crown"
            d="M74 264c31-28 76-42 119-68 33-20 54-45 75-91 8 34 8 64-5 91 28 8 53 29 69 60-65-17-173-13-258 8Z"
          />
          <path
            className="hat-light"
            d="M125 245c27-15 58-26 83-42 21-14 37-32 51-55-1 24-7 44-18 60 17 4 33 12 46 25-53-5-111-1-162 12Z"
          />
          <path
            className="hat-band"
            d="M99 243c67-17 153-24 220-11 5 7 9 14 12 22-71-17-166-13-251 8 5-7 11-13 19-19Z"
          />
          <path
            className="hat-buckle"
            d="m222 222 21-2 4 17-21 2-4-17Zm6 5 2 7 9-1-2-7-9 1Z"
          />
        </svg>
      </div>
      <p className="t-value object-value">
        {value === undefined ? "—" : value.toLocaleString()}
      </p>
    </section>
  )
}

function ConnectionControl({
  status,
  onToggle,
}: {
  status: Status
  onToggle: () => void
}) {
  const connected = status === "connected"
  return (
    <div className="control-row">
      <div className="control-copy">
        <span className="t-label">센서</span>
        <span className={`t-label connection-status ${status}`} role="status">
          <i aria-hidden="true" />
          {statusCopy[status]}
        </span>
      </div>
      <button
        className={`action-button ${connected ? "secondary" : "primary"}`}
        type="button"
        disabled={status === "connecting"}
        onClick={onToggle}
      >
        {connected ? "연결 끊기" : "센서 연결"}
      </button>
    </div>
  )
}

function PowerToggle({
  power,
  error,
  onToggle,
}: {
  power: boolean
  error: string
  onToggle: () => void
}) {
  return (
    <div className="power-control">
      <div className="control-row">
        <div className="control-copy">
          <span className="t-label">LED 전원</span>
          <span className="t-caption muted">{power ? "켜짐" : "꺼짐"}</span>
        </div>
        <button
          className="switch-button"
          type="button"
          role="switch"
          aria-checked={power}
          aria-label="LED 전원"
          onClick={onToggle}
        >
          <span className="switch-track" data-power={power ? "on" : "off"}>
            <span className="switch-thumb" />
          </span>
        </button>
      </div>
      {error && (
        <p className="t-caption power-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function SensorChart({ readings }: { readings: Reading[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const height = 200
  const left = 40
  const right = Math.max(left + 1, width - 8)
  const top = 8
  const bottom = height - 20
  const points = readings
    .map((reading, index) => {
      const x =
        readings.length < 2
          ? (left + right) / 2
          : left + (index / (readings.length - 1)) * (right - left)
      const y = bottom - (reading.value / SENSOR_MAX) * (bottom - top)
      return `${x},${y}`
    })
    .join(" ")
  const viewWidth = Math.max(width, 1)

  return (
    <section className="chart-section" aria-label="실시간 센서값">
      <div className="chart-wrap" ref={containerRef}>
        {readings.length === 0 ? (
          <p className="chart-empty t-body">
            센서를 연결하면 값이 여기에 그려집니다.
          </p>
        ) : (
          width > 0 && (
            <svg
              className="sensor-chart"
              viewBox={`0 0 ${viewWidth} ${height}`}
              role="img"
              aria-label={`센서값 추이, 현재 ${readings[readings.length - 1]?.value.toLocaleString()}`}
            >
              {[0, SENSOR_MAX / 2, SENSOR_MAX].map((value) => {
                const y = bottom - (value / SENSOR_MAX) * (bottom - top)
                return (
                  <g key={value}>
                    <line
                      x1={left}
                      x2={right}
                      y1={y}
                      y2={y}
                      className="chart-grid"
                    />
                    <text
                      x={left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="chart-label"
                    >
                      {value.toLocaleString()}
                    </text>
                  </g>
                )
              })}
              <polyline points={points} className="chart-line" />
              <text x={left} y={height - 2} className="chart-label">
                −60s
              </text>
              <text
                x={right}
                y={height - 2}
                textAnchor="end"
                className="chart-label"
              >
                지금
              </text>
            </svg>
          )
        )}
      </div>
    </section>
  )
}

function App() {
  const [status, setStatus] = useState<Status>("disconnected")
  const [power, setPower] = useState(false)
  const [readings, setReadings] = useState<Reading[]>([])
  const [demoActive, setDemoActive] = useState(demoMode)
  const [connectionError, setConnectionError] = useState("")
  const [powerError, setPowerError] = useState("")
  const channelRef = useRef<ReturnType<NonNullable<typeof db>["channel"]> | null>(
    null,
  )
  const demoIntervalRef = useRef<number | null>(null)
  const demoTickRef = useRef(0)

  useEffect(() => {
    document.title = PRODUCT.name || "Genie"
    if (!db) return

    let active = true
    const loadPower = async () => {
      const { data, error } = await db
        .from("device_state")
        .select("led_on")
        .eq("device_id", DEVICE_ID)
        .maybeSingle()
      if (!active) return
      if (error) {
        if (error.code === "PGRST205" || error.code === "42P01") {
          setDemoActive(true)
        } else {
          setPowerError(`전원 상태를 불러오지 못했습니다: ${error.message}`)
        }
      } else {
        setPower(data?.led_on ?? false)
      }
    }
    void loadPower()

    return () => {
      active = false
    }
  }, [])

  useEffect(
    () => () => {
      if (demoIntervalRef.current !== null) {
        window.clearInterval(demoIntervalRef.current)
      }
      if (db && channelRef.current) {
        void db.removeChannel(channelRef.current)
      }
    },
    [],
  )

  const appendReadings = (incoming: Reading[]) => {
    setReadings((current) => [...current, ...incoming].slice(-MAX_POINTS))
  }

  const makeDemoReading = (): Reading => {
    demoTickRef.current += 1
    const value = Math.round(
      SENSOR_MAX *
        (0.5 + 0.42 * Math.sin(demoTickRef.current / 7)) *
        (0.85 + 0.15 * Math.sin(demoTickRef.current / 17)),
    )
    return { value, created_at: new Date().toISOString() }
  }

  const startDemoStream = () => {
    setDemoActive(true)
    if (demoIntervalRef.current !== null) {
      window.clearInterval(demoIntervalRef.current)
    }
    appendReadings(Array.from({ length: MAX_POINTS }, makeDemoReading))
    setStatus("connected")
    demoIntervalRef.current = window.setInterval(() => {
      appendReadings([makeDemoReading()])
    }, 500)
  }

  const disconnectSensor = async () => {
    if (demoIntervalRef.current !== null) {
      window.clearInterval(demoIntervalRef.current)
      demoIntervalRef.current = null
    }
    if (db && channelRef.current) {
      await db.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setStatus("disconnected")
    setConnectionError("")
  }

  const connectSensor = async () => {
    setStatus("connecting")
    setConnectionError("")

    if (demoActive) {
      startDemoStream()
      return
    }

    if (!db) {
      setStatus("error")
      setConnectionError("Supabase 설정을 확인할 수 없습니다.")
      return
    }

    const { data, error } = await db
      .from("sensor_readings")
      .select("value, created_at")
      .eq("device_id", DEVICE_ID)
      .order("created_at", { ascending: false })
      .limit(MAX_POINTS)

    if (error) {
      if (error.code === "PGRST205" || error.code === "42P01") {
        startDemoStream()
        return
      }
      setStatus("error")
      setConnectionError(`센서 데이터를 불러오지 못했습니다: ${error.message}`)
      return
    }

    const initialReadings = (data ?? [])
      .filter(
        (row): row is Reading =>
          typeof row.value === "number" &&
          Number.isFinite(row.value) &&
          typeof row.created_at === "string",
      )
      .reverse()
    appendReadings(initialReadings)
    const channel = db
      .channel(`sensor-readings-${DEVICE_ID}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
          filter: `device_id=eq.${DEVICE_ID}`,
        },
        (payload) => {
          const row = payload.new as Partial<Reading>
          if (
            typeof row.value === "number" &&
            Number.isFinite(row.value) &&
            typeof row.created_at === "string"
          ) {
            appendReadings([{ value: row.value, created_at: row.created_at }])
          }
        },
      )
      .subscribe((nextStatus, error) => {
        if (nextStatus === "SUBSCRIBED") {
          setStatus("connected")
          setConnectionError("")
        } else if (
          nextStatus === "CHANNEL_ERROR" ||
          nextStatus === "TIMED_OUT"
        ) {
          setStatus("error")
          setConnectionError(
            error?.message ?? "Supabase Realtime 연결에 실패했습니다.",
          )
        }
      })
    channelRef.current = channel
  }

  const toggleSensor = () => {
    if (status === "connected") {
      void disconnectSensor()
    } else {
      void connectSensor()
    }
  }

  const togglePower = async () => {
    const nextPower = !power
    setPower(nextPower)
    setPowerError("")
    if (demoActive) return

    if (!db) {
      setPower(!nextPower)
      setPowerError("전원 변경 실패, 다시 시도")
      return
    }
    const { data, error } = await db
      .from("device_state")
      .update({ led_on: nextPower, updated_at: new Date().toISOString() })
      .eq("device_id", DEVICE_ID)
      .select("device_id")
      .maybeSingle()
    if (error || !data) {
      setPower(!nextPower)
      setPowerError(
        error?.message
          ? `전원 변경 실패, 다시 시도 (${error.message})`
          : "전원 변경 실패, 다시 시도",
      )
    }
  }

  const currentValue = readings[readings.length - 1]?.value

  return (
    <div className="lamp-app">
      <main className="lamp-main">
        <ProductHeader demoActive={demoActive} />
        {connectionError && status === "error" && (
          <p className="t-caption connection-error" role="alert">
            {connectionError}
          </p>
        )}
        <WizardHat value={currentValue} power={power} />
        <div className="dashboard-grid">
          <section className="controls-section" aria-label="조명 컨트롤">
            <ConnectionControl status={status} onToggle={toggleSensor} />
            <PowerToggle
              power={power}
              error={powerError}
              onToggle={() => void togglePower()}
            />
          </section>
          <SensorChart readings={readings} />
        </div>
      </main>
    </div>
  )
}

export default App
