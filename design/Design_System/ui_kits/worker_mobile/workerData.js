/* Worker Mobile — 100% Bangla mock data. Bengali numerals throughout. */
window.WorkerData = {
  worker: { name: "জামাল উদ্দিন", project: "মেঘনা ঘের", pond: "পুকুর এ২" },
  date: { bangla: "৫ শ্রাবণ ১৪৩৩", season: "বর্ষা" },
  greetingTime: "সকাল ৭:১৫",
  tasks: [
    { id: 1, title: "সকালের পানি পরীক্ষা", pond: "এ২", status: "DONE", sync: "SYNCED", time: "ভোর ৬:৩০" },
    { id: 2, title: "খাবার — দ্বিতীয় বার", pond: "বি১", status: "DUE", sync: "PENDING", time: "দুপুর ১:০০" },
    { id: 3, title: "জাল পরীক্ষা", pond: "সি৩", status: "SCHEDULED", sync: "SYNCED", time: "বিকাল ৪:০০" },
  ],
  recent: [
    { id: 1, kind: "খাবার দেওয়া হয়েছে", detail: "বি১ · ১২ কেজি · স্বাভাবিক", sync: "PENDING", time: "এইমাত্র" },
    { id: 2, kind: "পানি পরীক্ষা", detail: "এ২ · অক্সিজেন ৬.২ · পিএইচ ৭.৪", sync: "SYNCED", time: "ভোর ৬:৩০" },
    { id: 3, kind: "মৃত্যু লিপিবদ্ধ", detail: "এ২ · ৩টি গলদা", sync: "FAILED", time: "গতকাল" },
  ],
};
