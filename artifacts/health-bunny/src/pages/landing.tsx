import { useState } from "react";
import { motion } from "framer-motion";
import { AuthModal } from "@/components/auth-modal";
import { Logo } from "@/components/layout";
import { ShieldCheck, Zap, HeartPulse, ArrowRight } from "lucide-react";

const NAV_LINKS = ["Home", "About", "Features", "How It Works", "Contact"];

export default function Landing() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "#0b1a0e" }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col" style={{ minHeight: "100vh" }}>

        {/* background layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(75,148,66,0.22) 0%, transparent 70%), " +
              "radial-gradient(ellipse 50% 80% at 100% 50%, rgba(75,148,66,0.13) 0%, transparent 60%), " +
              "linear-gradient(135deg, #0b1a0e 0%, #112914 40%, #0e2010 100%)",
          }}
        />

        {/* subtle grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* glowing orb right */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(75,148,66,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── NAV ── */}
        <header className="relative z-20 w-full px-8 md:px-16 py-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(75,148,66,0.2)", border: "1px solid rgba(75,148,66,0.4)" }}>
              <Logo className="w-5 h-5" style={{ color: "#6dbe63" }} />
            </div>
            <span className="text-white font-bold text-lg tracking-wide">Health Bunny AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => setActiveNav(link)}
                className="text-sm font-medium transition-colors relative"
                style={{ color: activeNav === link ? "#6dbe63" : "rgba(255,255,255,0.65)" }}
              >
                {link}
                {activeNav === link && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "#6dbe63" }}
                  />
                )}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#4B9442", color: "#fff" }}
            data-testid="button-login-header"
          >
            Get Started
          </button>

          {/* mobile login */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="md:hidden text-sm font-medium"
            style={{ color: "#6dbe63" }}
          >
            Login
          </button>
        </header>

        {/* ── HERO CONTENT ── */}
        <div className="relative z-10 flex-1 flex items-center px-8 md:px-16 pb-24 pt-4">
          <div className="max-w-2xl">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
                style={{
                  background: "rgba(75,148,66,0.15)",
                  border: "1px solid rgba(75,148,66,0.35)",
                  color: "#6dbe63",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#6dbe63] animate-pulse" />
                Your AI Health Companion
              </div>

              <h1
                className="font-extrabold leading-[1.05] tracking-tight mb-6"
                style={{
                  fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
                  color: "#ffffff",
                }}
              >
                Fast AI-Powered<br />
                <span style={{ color: "#6dbe63" }}>Health Guidance</span><br />
                for Common Symptoms.
              </h1>

              <p
                className="text-lg leading-relaxed mb-10 max-w-xl"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Get instant, reliable insights on what might be causing your symptoms
                and safe home-care steps you can take today. Calm, reassuring, and
                always here for you.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
                  style={{ background: "#4B9442", color: "#fff", boxShadow: "0 0 32px rgba(75,148,66,0.4)" }}
                  data-testid="button-get-started"
                >
                  Check My Symptoms
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
                >
                  Sign In
                </button>
              </div>

              <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Free &amp; secure. No credit card required.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── FEATURE PILLS bottom of hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 px-8 md:px-16 pb-16 flex flex-wrap gap-4"
        >
          {[
            { icon: <Zap className="w-4 h-4" />, text: "Instant Analysis" },
            { icon: <ShieldCheck className="w-4 h-4" />, text: "Safe & Reliable" },
            { icon: <HeartPulse className="w-4 h-4" />, text: "Private by Design" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <span style={{ color: "#6dbe63" }}>{icon}</span>
              {text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <section style={{ background: "#0d1f10" }} className="px-8 md:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#6dbe63" }}>Why Health Bunny</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-16 max-w-lg leading-tight">
            Everything you need to understand your health.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Instant Analysis",
              desc: "Get answers in seconds. Describe your symptoms and receive structured, evidence-based guidance immediately.",
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Safe & Reliable",
              desc: "Evidence-based home-care steps with clear red-flag warnings on when to seek professional medical care.",
            },
            {
              icon: <HeartPulse className="w-6 h-6" />,
              title: "Private by Design",
              desc: "Your health data is yours alone. Secured with Firebase Auth and never shared with third parties.",
            },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(75,148,66,0.15)", color: "#6dbe63" }}
              >
                {icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-8 md:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        style={{ background: "#0b1a0e", color: "rgba(255,255,255,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <Logo className="w-4 h-4" style={{ color: "#4B9442" }} />
          <span>© 2026 Health Bunny AI. All Rights Reserved.</span>
        </div>
        <span>Not a medical diagnosis tool. Always consult a qualified healthcare professional.</span>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
