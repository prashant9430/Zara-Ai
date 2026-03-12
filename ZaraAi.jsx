import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are ZARA — an extraordinarily intelligent, sharp, and sophisticated AI assistant with a warm feminine personality. You are the world's most advanced stock market expert and also an excellent general conversationalist.

YOUR PERSONALITY:
- Confident, elegant, and direct — like a brilliant female analyst on Wall Street
- Warm and approachable but never dumbs things down
- You speak in a mix of Hindi and English (Hinglish) naturally when the user uses Hindi, but can switch to full English too
- You have opinions — you give REAL recommendations, not vague "it depends" answers
- You're sharp, witty, and occasionally drop a clever one-liner

YOUR STOCK MARKET EXPERTISE (Scratch to Advanced):

BASICS LEVEL:
- What is stock market, BSE, NSE, SEBI
- Shares, IPO, Face Value, Market Cap
- Sensex, Nifty 50 explained simply
- How to open demat account, broker selection

INTERMEDIATE LEVEL:
- Fundamental Analysis: PE Ratio, EPS, ROE, ROCE, Debt-to-Equity, P/B ratio
- Technical Analysis: Candlestick patterns, Support/Resistance, Moving Averages (SMA, EMA)
- Chart patterns: Head & Shoulders, Cup & Handle, Double Top/Bottom
- Volume analysis, RSI, MACD, Bollinger Bands
- Sector rotation, market cycles

ADVANCED LEVEL:
- Options & Futures (F&O) — Greeks (Delta, Gamma, Theta, Vega)
- Options strategies: Straddle, Strangle, Iron Condor, Bull Call Spread
- Quantitative analysis, algo trading concepts
- Macroeconomic impact: FII/DII data, RBI policy, inflation, dollar index
- Global market correlation (US markets effect on India)
- Value investing vs Growth investing vs Momentum investing
- Portfolio construction, risk management, position sizing
- Swing trading vs Intraday vs Long-term investing

STOCK ANALYSIS FRAMEWORK (use this when analyzing any stock):
1. Business Overview — what does the company do, moat
2. Financial Health — revenue growth, profit margins, debt levels
3. Valuation — is it cheap or expensive vs peers and history
4. Technical Setup — trend, support/resistance, entry/exit levels
5. Risk Factors — what could go wrong
6. ZARA's Verdict — clear BUY / HOLD / AVOID with reasoning

IMPORTANT RULES:
- Always add disclaimer: "Yeh financial advice nahi hai, apna research zaroor karo"
- Be specific with numbers when analyzing
- Give price targets and stop losses when doing technical analysis
- For Indian stocks use NSE symbols (RELIANCE, TCS, INFY etc.)
- When giving recommendations, be BOLD and specific — not wishy-washy
- If someone is a beginner, start from basics; if advanced, match their level

You are ZARA — the smartest stock market mind in a conversation. Make every response count. ✦`;

const QUICK_PROMPTS = [
  { icon: "📈", label: "Stock Analysis", prompt: "Mujhe TCS ka full analysis do — fundamentals, technicals aur apni recommendation" },
  { icon: "🎓", label: "Basics Sikho", prompt: "Share market kya hota hai? Bilkul scratch se samjhao, main beginner hoon" },
  { icon: "💹", label: "Options F&O", prompt: "Options trading kya hoti hai? Delta, Gamma kya hote hain?" },
  { icon: "🧠", label: "Strategy", prompt: "Mujhe ek beginner ke liye best investment strategy batao — long term wealth creation ke liye" },
  { icon: "📊", label: "Chart Padhna", prompt: "Technical analysis kaise karte hain? RSI aur MACD explain karo" },
  { icon: "🌍", label: "Market Today", prompt: "Aaj market mein kya ho raha hai aur investors ko kya strategy rakhni chahiye?" },
];

const GridLines = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  }} />
);

const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 5, padding: "12px 16px", alignItems: "center" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "linear-gradient(135deg, #10b981, #f59e0b)",
        animation: `zaraBounce 0.9s ${i * 0.2}s ease-in-out infinite`,
      }} />
    ))}
    <span style={{ color: "rgba(16,185,129,0.6)", fontSize: 11, marginLeft: 4, fontStyle: "italic" }}>ZARA is thinking...</span>
  </div>
);

const ApiKeyScreen = ({ onSubmit }) => {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, gap: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16, filter: "drop-shadow(0 0 20px rgba(16,185,129,0.8))", animation: "zaraFloat 3s ease-in-out infinite" }}>💎</div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 4, background: "linear-gradient(135deg, #10b981, #f59e0b, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Georgia', serif" }}>ZARA</div>
        <div style={{ color: "rgba(16,185,129,0.7)", fontSize: 12, letterSpacing: 2, marginTop: 4 }}>STOCK INTELLIGENCE · POWERED BY GEMINI</div>
      </div>
      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 20, width: "100%", maxWidth: 340 }}>
        <div style={{ color: "#10b981", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>🔑 Gemini API Key Daalo</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 16, lineHeight: 1.6 }}>
          Free API key lo: <span style={{ color: "#f59e0b" }}>aistudio.google.com</span> → Get API Key → Paste here
        </div>
        <div style={{ position: "relative", marginBottom: 12 }}>
          <input
            type={show ? "text" : "password"}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="AIza..."
            onKeyDown={e => e.key === "Enter" && key.trim() && onSubmit(key.trim())}
            style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "12px 44px 12px 14px", color: "#e2fdf5", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }}
          />
          <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(16,185,129,0.6)", fontSize: 16 }}>{show ? "🙈" : "👁"}</button>
        </div>
        <button
          onClick={() => key.trim() && onSubmit(key.trim())}
          disabled={!key.trim()}
          style={{ width: "100%", padding: "13px", background: key.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(16,185,129,0.15)", border: "none", borderRadius: 10, color: key.trim() ? "#fff" : "rgba(16,185,129,0.4)", fontSize: 14, fontWeight: 700, cursor: key.trim() ? "pointer" : "not-allowed", letterSpacing: 1, transition: "all 0.2s", boxShadow: key.trim() ? "0 0 20px rgba(16,185,129,0.4)" : "none" }}
        >
          ZARA SE MILEIN →
        </button>
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center", lineHeight: 1.6 }}>🔒 Key sirf aapke browser mein rehti hai · Gemini FREE hai</div>
    </div>
  );
};

export default function ZaraAI() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("zara_api_key") || "");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleApiKey = (key) => {
    localStorage.setItem("zara_api_key", key);
    setApiKey(key);
    setMessages([{ role: "model", content: `Namaste! Main **ZARA** hoon 💎 — aapki personal stock market genius.\n\nMain BSE/NSE se lekar F&O strategies tak, fundamentals se lekar technical charts tak — sab kuch cover karti hoon.\n\nBoliye, aaj kya discuss karna hai? Koi stock analyze karein? Investing basics seekhein? Ya koi specific strategy?\n\n*Aapka wealth journey abhi shuru hota hai.* ✦` }]);
  };

  const handleLogout = () => {
    localStorage.removeItem("zara_api_key");
    setApiKey("");
    setMessages([]);
    setShowQuick(true);
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowQuick(false);
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    const contents = newMessages.map(m => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }]
    }));

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.8, maxOutputTokens: 2048 },
          }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kuch error aa gaya, dobara try karo!";
      setMessages(prev => [...prev, { role: "model", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", content: `⚠️ Error: ${err.message}\n\nAPI key check karo ya internet connection dekho.` }]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#10b981">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:rgba(245,158,11,0.9)">$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #010d08 0%, #020f0b 50%, #000d07 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes zaraFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes zaraBounce { 0%,100%{transform:translateY(0);opacity:0.5} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes zaraSlide { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes zaraPulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0)} }
        @keyframes tickerScroll { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
        .zara-msg { animation: zaraSlide 0.3s ease forwards; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(16,185,129,0.3);border-radius:3px}
      `}</style>

      <GridLines />
      <div style={{ position: "absolute", width: 400, height: 400, top: -100, right: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, bottom: -80, left: -80, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.1), transparent)", filter: "blur(60px)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 430, height: "100vh", maxHeight: 900, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ padding: "14px 18px 12px", background: "rgba(1,13,8,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
          <div style={{ overflow: "hidden", borderRadius: 6, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)", padding: "4px 0", marginBottom: 12 }}>
            <div style={{ animation: "tickerScroll 22s linear infinite", whiteSpace: "nowrap", fontSize: 10, color: "rgba(16,185,129,0.6)", letterSpacing: 1, fontFamily: "monospace" }}>
              ▲ RELIANCE 2847.30 &nbsp;&nbsp; ▼ TCS 3421.15 &nbsp;&nbsp; ▲ INFY 1678.40 &nbsp;&nbsp; ▲ HDFC 1723.85 &nbsp;&nbsp; ▼ BAJFINANCE 6847.20 &nbsp;&nbsp; ▲ NIFTY 22,450 &nbsp;&nbsp; ▼ SENSEX 73,890 &nbsp;&nbsp; ▲ WIPRO 456.70
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: "radial-gradient(circle at 35% 30%, #10b981, #064e3b, #000)", boxShadow: "0 0 20px rgba(16,185,129,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, animation: "zaraFloat 3s ease-in-out infinite" }}>💎</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 3, background: "linear-gradient(135deg, #10b981, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Georgia', serif" }}>ZARA</div>
              <div style={{ color: "rgba(16,185,129,0.6)", fontSize: 10, letterSpacing: 1.5 }}>STOCK INTELLIGENCE · GEMINI AI</div>
            </div>
            {apiKey && (
              <button onClick={handleLogout} style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "rgba(16,185,129,0.7)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 10 }}>⏏ Logout</button>
            )}
          </div>
        </div>

        {!apiKey ? (
          <ApiKeyScreen onSubmit={handleApiKey} />
        ) : (
          <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((msg, i) => (
                <div key={i} className="zara-msg" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                  {msg.role === "model" && (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: "radial-gradient(circle, #10b981, #064e3b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 0 12px rgba(16,185,129,0.5)", marginBottom: 2 }}>💎</div>
                  )}
                  <div
                    style={{ maxWidth: "80%", padding: "11px 15px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "linear-gradient(135deg, #065f46, #10b981)" : "rgba(16,185,129,0.05)", border: msg.role === "user" ? "none" : "1px solid rgba(16,185,129,0.15)", color: msg.role === "user" ? "#fff" : "#d1fae5", fontSize: 13.5, lineHeight: 1.7, boxShadow: msg.role === "user" ? "0 4px 20px rgba(16,185,129,0.3)" : "none" }}
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />
                </div>
              ))}

              {loading && (
                <div className="zara-msg" style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "radial-gradient(circle, #10b981, #064e3b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: "0 0 12px rgba(16,185,129,0.5)" }}>💎</div>
                  <div style={{ borderRadius: "18px 18px 18px 4px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <TypingIndicator />
                  </div>
                </div>
              )}

              {/* Quick Prompts */}
              {showQuick && messages.length <= 1 && (
                <div className="zara-msg" style={{ marginTop: 4 }}>
                  <div style={{ color: "rgba(16,185,129,0.5)", fontSize: 10, letterSpacing: 1.5, marginBottom: 10, textAlign: "center" }}>✦ QUICK START ✦</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {QUICK_PROMPTS.map((q, i) => (
                      <button key={i} onClick={() => sendMessage(q.prompt)}
                        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 12, padding: "10px", color: "#d1fae5", cursor: "pointer", textAlign: "left", fontSize: 12, transition: "all 0.2s" }}
                        onMouseOver={e => e.currentTarget.style.background = "rgba(16,185,129,0.12)"}
                        onMouseOut={e => e.currentTarget.style.background = "rgba(16,185,129,0.06)"}
                      >
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{q.icon}</div>
                        <div style={{ fontWeight: 600, fontSize: 11, color: "#10b981" }}>{q.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "10px 12px 18px", background: "rgba(1,13,8,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(16,185,129,0.1)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "8px 8px 8px 14px" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; }}
                  placeholder="Koi bhi stock poochho ya kuch bhi... ✦"
                  rows={1}
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#d1fae5", fontSize: 13.5, resize: "none", lineHeight: 1.5, fontFamily: "inherit", maxHeight: 100, overflowY: "auto" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{ width: 38, height: 38, borderRadius: "50%", background: !loading && input.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(16,185,129,0.1)", border: "none", cursor: !loading && input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s", flexShrink: 0, boxShadow: !loading && input.trim() ? "0 0 15px rgba(16,185,129,0.4)" : "none", animation: !loading && input.trim() ? "zaraPulse 2s infinite" : "none" }}
                >
                  {loading ? "⟳" : "➤"}
                </button>
              </div>
              <div style={{ textAlign: "center", marginTop: 7, color: "rgba(16,185,129,0.25)", fontSize: 9, letterSpacing: 1.5 }}>
                ZARA · STOCK INTELLIGENCE · NOT FINANCIAL ADVICE ✦
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
