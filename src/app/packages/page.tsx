"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { PLANS } from "@/lib/plans"
import type { PlanId } from "@/lib/plans"
import { Check, ChevronLeft, ArrowRight, Sparkles } from "lucide-react"

function SparkLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
      <path d="M19 1L19.8 3.2L22 4L19.8 4.8L19 7L18.2 4.8L16 4L18.2 3.2Z" opacity="0.7" />
    </svg>
  )
}

export default function PackagesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  const [selected, setSelected] = useState<PlanId>("pro")

  function handleContinue() {
    const plan = PLANS.find(p => p.id === selected)!
    if (plan.price === 0) {
      router.push("/")
    } else {
      router.push(`/payment?plan=${selected}`)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FCEDDB",
      fontFamily: "var(--font-nunito)",
    }}>

      {/* ── Top bar ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px",
        background: "rgba(252,237,219,0.88)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(216,155,92,0.14)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg, #2DB89E 0%, #34D4B5 100%)",
            color: "#fff", display: "grid", placeItems: "center",
            boxShadow: "0 5px 12px rgba(45,184,158,0.35)",
          }}>
            <SparkLogo />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#2A2F4A", letterSpacing: -0.4, lineHeight: 1 }}>
              Telesesh <span style={{ color: "#2DB89E" }}>Spark</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9A8B7E", marginTop: 2 }}>
              Choose your plan
            </div>
          </div>
        </div>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 16px", borderRadius: 12,
            border: "2px solid #F4DCC4", background: "#fff",
            color: "#6C6580", fontWeight: 700, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Skip for now
          </button>
        </Link>
      </header>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "56px 32px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 16px", borderRadius: 999,
            background: "#fff", border: "1px solid #F4DCC4",
            color: "#D76B3F", fontSize: 12, fontWeight: 800, letterSpacing: 0.8,
            marginBottom: 20,
          }}>
            <Sparkles size={12} /> CHOOSE YOUR PLAN
          </div>
          <h1 style={{
            margin: "0 0 14px",
            fontSize: 42, fontWeight: 900, color: "#2A2F4A",
            letterSpacing: -1, lineHeight: 1.05,
          }}>
            {firstName !== "there" ? `Welcome, ${firstName}! ` : ""}Pick the plan that fits
          </h1>
          <p style={{ margin: 0, fontSize: 17, color: "#6C6580", fontWeight: 600 }}>
            Switch or cancel anytime. No surprises.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20, marginBottom: 40,
          alignItems: "start",
        }}>
          {PLANS.map(plan => {
            const active = selected === plan.id
            return (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  position: "relative",
                  background: "#fff", borderRadius: 26, padding: "28px 26px",
                  border: "3px solid",
                  borderColor: active ? plan.color : "#F0E4D6",
                  cursor: "pointer",
                  boxShadow: active
                    ? `0 20px 48px -16px ${plan.color}55`
                    : "0 6px 20px -10px rgba(40,20,10,0.1)",
                  transform: active ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.22s cubic-bezier(.2,.8,.2,1)",
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
                }}
              >
                {/* Popular badge */}
                {"popular" in plan && plan.popular && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    padding: "5px 16px", borderRadius: 999,
                    background: plan.color, color: "#fff",
                    fontWeight: 800, fontSize: 11.5, letterSpacing: 0.6,
                    whiteSpace: "nowrap",
                    boxShadow: `0 6px 14px ${plan.color}55`,
                  }}>
                    MOST POPULAR
                  </div>
                )}

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13,
                    background: plan.soft, color: plan.color,
                    display: "grid", placeItems: "center", fontSize: 22,
                  }}>
                    {plan.id === "starter" ? "🌱" : plan.id === "pro" ? "⭐" : "🏥"}
                  </div>
                  {/* Selection indicator */}
                  <div style={{
                    width: 26, height: 26, borderRadius: 999,
                    border: "2px solid", borderColor: active ? plan.color : "#D6C8B6",
                    background: active ? plan.color : "#fff",
                    display: "grid", placeItems: "center",
                    transition: "all 0.18s",
                  }}>
                    {active && <Check size={13} color="#fff" strokeWidth={3} />}
                  </div>
                </div>

                <div style={{ fontSize: 22, fontWeight: 900, color: "#2A2F4A", marginBottom: 2 }}>{plan.name}</div>
                <div style={{ fontSize: 13.5, color: "#6C6580", fontWeight: 700, marginBottom: 18 }}>{plan.tagline}</div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 22 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: "#2A2F4A", letterSpacing: -1.5, lineHeight: 1 }}>
                    ${plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: "#9A8B7E", fontWeight: 700 }}>/ {plan.period}</span>
                </div>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, fontWeight: 700, color: "#4A4560" }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 999, flexShrink: 0, marginTop: 1,
                        background: plan.soft, color: plan.color,
                        display: "grid", placeItems: "center",
                      }}>
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
          <Link href="/sign-up" style={{ textDecoration: "none" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "14px 24px", borderRadius: 16,
              border: "2px solid #F0E4D6", background: "#fff",
              color: "#2A2F4A", fontWeight: 800, fontSize: 15,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              <ChevronLeft size={17} /> Back
            </button>
          </Link>
          <button
            onClick={handleContinue}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "14px 32px", borderRadius: 16, border: "none",
              background: PLANS.find(p => p.id === selected)?.color ?? "#D76B3F",
              color: "#fff", fontWeight: 800, fontSize: 15,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 10px 24px ${PLANS.find(p => p.id === selected)?.color ?? "#D76B3F"}55`,
              transition: "transform 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            {selected === "starter" ? "Start for free" : `Continue with ${PLANS.find(p => p.id === selected)?.name}`}
            <ArrowRight size={17} />
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13.5, color: "#9A8B7E", fontWeight: 600 }}>
          You can upgrade, downgrade or cancel anytime from settings.
        </p>
      </div>
    </div>
  )
}
