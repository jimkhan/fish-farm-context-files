const { useState } = React;
const NS = window.FMSAquacultureDesignSystem_dbe44a;
const { Button, StatusBadge, SyncBadge, ConnectivityBar, StateView, Icon, DualDate } = NS;
const W = window.WorkerData;
const BN = (n) => String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

const bangla = { fontFamily: "var(--font-bangla)" };

/* Icon-first action tiles */
const ACTIONS = [
  { id: "feed", label: "খাবার", icon: "utensils", color: "var(--brand-primary)" },
  { id: "water", label: "পানি", icon: "droplet", color: "var(--brand-accent)" },
  { id: "mortality", label: "মৃত্যু", icon: "skull", color: "var(--text-secondary)" },
  { id: "task", label: "কাজ", icon: "clipboard-list", color: "var(--sev-info)" },
  { id: "camera", label: "ক্যামেরা", icon: "camera", color: "var(--brand-primary-dark)" },
  { id: "emergency", label: "জরুরি", icon: "life-buoy", color: "var(--sev-critical)" },
];

function Home({ online, setScreen, recent }) {
  return (
    <div style={{ ...bangla, display: "flex", flexDirection: "column", height: "100%" }}>
      <ConnectivityBar online={online} pending={online ? 2 : 3} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>স্বাগতম, {W.worker.name}</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2 }}>
            {W.worker.project} · {W.worker.pond}
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 2, display: "flex", gap: 6, alignItems: "center" }}>
            <Icon name="calendar" size={15} /><DualDate mode="bn" bangla="5 শ্রাবণ 1433" season={W.date.season} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {ACTIONS.map((a) => (
            <button key={a.id} onClick={() => setScreen(a.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              minHeight: 96, padding: 12, borderRadius: 16, cursor: "pointer",
              background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)",
              fontFamily: "var(--font-bangla)",
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 999, background: a.id === "emergency" ? "var(--tint-critical)" : "var(--tint-brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={a.icon} size={28} color={a.color} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{a.label}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>আজকের কাজ</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {W.tasks.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>পুকুর {t.pond} · {t.time}</div>
              </div>
              <StatusBadge kind="task" status={t.status} lang="bn" />
            </div>
          ))}
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>সাম্প্রতিক এন্ট্রি</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{r.kind}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{r.detail} · {r.time}</div>
              </div>
              <SyncBadge state={r.sync} showLabel={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedForm({ online, onSave, onBack }) {
  const [weight, setWeight] = useState("12");
  const [obs, setObs] = useState("NORMAL");
  const chips = [{ v: "NORMAL", l: "স্বাভাবিক" }, { v: "LEFTOVER", l: "উদ্বৃত্ত" }, { v: "EMPTY", l: "খালি" }];
  return (
    <div style={{ ...bangla, display: "flex", flexDirection: "column", height: "100%" }}>
      <TitleBar title="খাবার লিপিবদ্ধ" onBack={onBack} />
      <ConnectivityBar online={online} pending={online ? 2 : 3} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>পুকুর</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["এ২", "বি১", "সি৩"].map((p, i) => (
              <div key={p} style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRadius: 12, fontSize: 16, fontWeight: 600,
                border: "1px solid " + (i === 0 ? "var(--brand-primary)" : "var(--border)"),
                background: i === 0 ? "var(--tint-brand)" : "var(--surface)", color: i === 0 ? "var(--brand-primary-dark)" : "var(--text-secondary)" }}>{p}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>পরিমাণ (কেজি)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BigStep onClick={() => setWeight((w) => String(Math.max(0, +w - 1)))} icon="chevron-down" />
            <div style={{ flex: 1, textAlign: "center", fontSize: 34, fontWeight: 700, fontFamily: "var(--font-bangla)" }}>{BN(weight)}</div>
            <BigStep onClick={() => setWeight((w) => String(+w + 1))} icon="plus" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>খাবারের পর্যবেক্ষণ</div>
          <div style={{ display: "flex", gap: 8 }}>
            {chips.map((c) => (
              <button key={c.v} onClick={() => setObs(c.v)} style={{ flex: 1, padding: "14px 0", borderRadius: 12, cursor: "pointer", fontFamily: "var(--font-bangla)", fontSize: 15, fontWeight: 600,
                border: "1px solid " + (obs === c.v ? "var(--brand-primary)" : "var(--border)"),
                background: obs === c.v ? "var(--tint-brand)" : "var(--surface)", color: obs === c.v ? "var(--brand-primary-dark)" : "var(--text-secondary)" }}>{c.l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: 16, borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <Button size="lg" block icon="check" onClick={() => onSave({ weight, obs })} lang="bn">সংরক্ষণ করুন</Button>
      </div>
    </div>
  );
}

function BigStep({ onClick, icon }) {
  return (
    <button onClick={onClick} style={{ width: 56, height: 56, borderRadius: 16, border: "1px solid var(--border-strong)", background: "var(--surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={24} color="var(--brand-primary)" />
    </button>
  );
}

function Emergency({ onBack, onRaise }) {
  return (
    <div style={{ ...bangla, display: "flex", flexDirection: "column", height: "100%", background: "var(--tint-critical)" }}>
      <TitleBar title="জরুরি অবস্থা" onBack={onBack} tone="critical" />
      <div style={{ flex: 1, overflow: "auto", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <div style={{ width: 88, height: 88, borderRadius: 999, background: "var(--sev-critical)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
          <Icon name="life-buoy" size={44} color="#fff" />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>অক্সিজেন / পানির জরুরি অবস্থা</div>
        <div style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 300 }}>
          এই বোতাম চাপলে মালিককে সঙ্গে সঙ্গে সতর্কবার্তা পাঠানো হবে। মাছ ভেসে উঠছে বা হাঁপাচ্ছে?
        </div>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <Button size="lg" block variant="danger" icon="life-buoy" onClick={onRaise} lang="bn">এখনই সতর্কবার্তা পাঠান</Button>
        <Button size="lg" block variant="secondary" onClick={onBack} lang="bn">বাতিল</Button>
      </div>
    </div>
  );
}

function Placeholder({ title, onBack }) {
  return (
    <div style={{ ...bangla, display: "flex", flexDirection: "column", height: "100%" }}>
      <TitleBar title={title} onBack={onBack} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: 20 }}>
        <StateView variant="offline" lang="bn" title="অফলাইন — সংরক্ষিত"
          message="আপনার এন্ট্রি সংরক্ষিত হয়েছে, নেটওয়ার্ক এলে সিংক হবে।"
          action={<Button size="lg" variant="secondary" onClick={onBack} lang="bn">ফিরে যান</Button>} />
      </div>
    </div>
  );
}

function TitleBar({ title, onBack, tone }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 12px", background: "var(--surface)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <button onClick={onBack} aria-label="ফিরে যান" style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="arrow-left" size={24} color={tone === "critical" ? "var(--sev-critical)" : "var(--text-primary)"} />
      </button>
      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-bangla)" }}>{title}</span>
    </div>
  );
}

function Toast({ text }) {
  return (
    <div style={{ position: "absolute", left: 16, right: 16, bottom: 24, zIndex: 20, display: "flex", alignItems: "center", gap: 10,
      padding: "12px 14px", borderRadius: 12, background: "var(--text-primary)", color: "#fff", fontFamily: "var(--font-bangla)", fontSize: 14, boxShadow: "var(--shadow-modal)" }}>
      <Icon name="check-circle" size={20} color="var(--status-ok)" />{text}
    </div>
  );
}

function WorkerApp() {
  const [screen, setScreen] = useState("feed" === "x" ? "feed" : "home");
  const [online, setOnline] = useState(false);
  const [recent, setRecent] = useState(W.recent);
  const [toast, setToast] = useState(null);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 2600); };

  const saveFeed = ({ weight, obs }) => {
    const obsL = { NORMAL: "স্বাভাবিক", LEFTOVER: "উদ্বৃত্ত", EMPTY: "খালি" }[obs];
    setRecent((r) => [{ id: Date.now(), kind: "খাবার দেওয়া হয়েছে", detail: `এ২ · ${BN(weight)} কেজি · ${obsL}`, sync: "PENDING", time: "এইমাত্র" }, ...r]);
    setScreen("home");
    showToast(online ? "সংরক্ষিত — সিংক হচ্ছে" : "অফলাইন — সংরক্ষিত, পরে সিংক হবে");
  };

  let body;
  if (screen === "feed") body = <FeedForm online={online} onSave={saveFeed} onBack={() => setScreen("home")} />;
  else if (screen === "emergency") body = <Emergency onBack={() => setScreen("home")} onRaise={() => { setScreen("home"); showToast("সতর্কবার্তা পাঠানো হয়েছে (সারিবদ্ধ)"); }} />;
  else if (screen === "home") body = <Home online={online} setScreen={setScreen} recent={recent} />;
  else body = <Placeholder title={{ water: "পানি পরীক্ষা", mortality: "মৃত্যু লিপিবদ্ধ", task: "কাজের তালিকা", camera: "ক্যামেরা" }[screen]} onBack={() => setScreen("home")} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24, minHeight: "100vh", background: "var(--surface-muted)", fontFamily: "var(--font-bangla)" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: "var(--font-base)", fontSize: 13, color: "var(--text-secondary)" }}>
        Network:
        <button onClick={() => setOnline((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 999, cursor: "pointer",
          border: "1px solid var(--border)", background: "var(--surface)", color: online ? "var(--status-ok)" : "var(--sev-warning)", fontWeight: 600 }}>
          <Icon name={online ? "wifi" : "wifi-off"} size={16} />{online ? "Online" : "Offline"}
        </button>
      </div>
      <div style={{ position: "relative", width: 390, height: 800, background: "#000", borderRadius: 44, padding: 10, boxShadow: "var(--shadow-modal)" }}>
        <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 120, height: 26, background: "#000", borderRadius: 999, zIndex: 30 }}></div>
        <div style={{ position: "relative", width: "100%", height: "100%", background: "var(--bg)", borderRadius: 34, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 44, flexShrink: 0, background: "var(--surface)" }}></div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {body}
          </div>
          {toast ? <Toast text={toast} /> : null}
        </div>
      </div>
    </div>
  );
}

window.WorkerApp = WorkerApp;
