/* Owner Web — mock domain data. Business content only. */
window.OwnerData = {
  owner: { name: "Rahima Khatun", initials: "RK" },
  today: { gregorian: "2026-07-21", bangla: "5 শ্রাবণ 1433" },
  projects: [
    {
      id: "meghna", name: "Meghna Gher", place: "Debidwar, Cumilla", status: "ACTIVE",
      worker: "Jamal Uddin", partner: "A. Karim (investor)",
      ponds: 4, batches: 3, revenue: 842000, cost: 512000,
      survival: 88, alerts: 1,
    },
    {
      id: "padma", name: "Padma Project", place: "Bhanga, Faridpur", status: "ACTIVE",
      worker: "Sultana Begum", partner: null,
      ponds: 3, batches: 2, revenue: 403000, cost: 268000,
      survival: 91, alerts: 0,
    },
    {
      id: "jamuna", name: "Jamuna Gher", place: "Sariakandi, Bogura", status: "HARVESTING",
      worker: "Anwar Hossain", partner: "Nasrin Trading",
      ponds: 5, batches: 2, revenue: 1120000, cost: 690000,
      survival: 84, alerts: 2,
    },
  ],
  batchesByProject: {
    meghna: [
      { id: "A2", pond: "Pond A2", species: "SPF Golda", status: "ACTIVE", stocked: "2026-04-12", bangla: "30 চৈত্র 1432", pcs: 42000, doc: 100 },
      { id: "B1", pond: "Pond B1", species: "Parse (mullet)", status: "ACTIVE", stocked: "2026-05-02", bangla: "19 বৈশাখ 1433", pcs: 18000, doc: 80 },
      { id: "C3", pond: "Pond C3", species: "Carp (Rui/Katla)", status: "HARVESTING", stocked: "2026-01-20", bangla: "7 মাঘ 1432", pcs: 9500, doc: 182 },
    ],
    padma: [
      { id: "P1", pond: "Pond P1", species: "SPF Golda", status: "ACTIVE", stocked: "2026-04-28", bangla: "15 বৈশাখ 1433", pcs: 36000, doc: 84 },
      { id: "P2", pond: "Pond P2", species: "Carp (Mrigel)", status: "ACTIVE", stocked: "2026-03-10", bangla: "27 ফাল্গুন 1432", pcs: 12000, doc: 133 },
    ],
    jamuna: [
      { id: "J1", pond: "Pond J1", species: "SPF Golda", status: "HARVESTING", stocked: "2025-12-15", bangla: "1 পৌষ 1432", pcs: 51000, doc: 218 },
      { id: "J4", pond: "Pond J4", species: "Parse (mullet)", status: "ACTIVE", stocked: "2026-05-20", bangla: "6 জ্যৈষ্ঠ 1433", pcs: 22000, doc: 62 },
    ],
  },
  alertsByProject: {
    meghna: [
      { id: 1, severity: "WARNING", state: "SENT", title: "Dissolved oxygen dropping", pond: "Pond A2", time: "2026-07-21 06:10", bangla: "5 শ্রাবণ, ভোর 6:10", note: "DO 4.1 mg/L before dawn. Worker notified to run aerator." },
    ],
    padma: [],
    jamuna: [
      { id: 2, severity: "CRITICAL", state: "RAISED", title: "Emergency raised by worker", pond: "Pond J1", time: "2026-07-21 05:40", bangla: "5 শ্রাবণ, ভোর 5:40", note: "Fish surfacing / gasping. Immediate aeration + partial water exchange requested." },
      { id: 3, severity: "INFO", state: "RESOLVED", title: "Feed delivery received", pond: "Store", time: "2026-07-20 14:00", bangla: "4 শ্রাবণ, দুপুর 2:00", note: "1,200 kg grower feed logged to inventory." },
    ],
  },
  tasksByProject: {
    meghna: [
      { id: 1, title: "Morning water test — A2", status: "DONE", who: "Jamal", time: "06:30" },
      { id: 2, title: "Feed round 2 — B1", status: "DUE", who: "Jamal", time: "13:00" },
      { id: 3, title: "Net check — C3 harvest prep", status: "SCHEDULED", who: "Jamal", time: "16:00" },
    ],
    padma: [
      { id: 1, title: "Feed round 1 — P1", status: "DONE", who: "Sultana", time: "07:00" },
      { id: 2, title: "Weekly sampling — P2", status: "MISSED", who: "Sultana", time: "yesterday" },
    ],
    jamuna: [
      { id: 1, title: "Harvest grading — J1", status: "DUE", who: "Anwar", time: "now" },
      { id: 2, title: "Emergency aeration — J1", status: "DUE", who: "Anwar", time: "now" },
    ],
  },
};
