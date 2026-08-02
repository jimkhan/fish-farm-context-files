/* FMS localization helpers — business logic only (no styling).
   Bengali numerals, BDT money (lakh/crore grouping), Bangla month/season names.
   NOTE: real Gregorian<->Bangla calendar conversion comes from the app's own
   calendar package. These helpers format numerals/money and provide Bangla
   month + season (ritu) names; pass an explicit Bangla date for display. */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumerals(input) {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);
}

/** South-Asian (lakh/crore) grouping of an integer's digits, as a string. */
export function groupSouthAsian(intStr) {
  const neg = intStr.startsWith("-");
  let s = neg ? intStr.slice(1) : intStr;
  if (s.length <= 3) return (neg ? "-" : "") + s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (neg ? "-" : "") + rest + "," + last3;
}

/** Whole-taka BDT: "৳" + Bengali numerals + lakh/crore grouping. No decimals. */
export function formatBDT(amount, { bengali = true } = {}) {
  const rounded = Math.round(Number(amount) || 0);
  const grouped = groupSouthAsian(String(rounded));
  const withNumerals = bengali ? toBengaliNumerals(grouped) : grouped;
  return "৳" + withNumerals;
}

export const BANGLA_MONTHS = [
  "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
  "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র",
];

/** Bangla seasons (ritu) */
export const BANGLA_SEASONS = {
  grishmo: "গ্রীষ্ম",   // summer
  borsha: "বর্ষা",      // monsoon
  sharat: "শরৎ",       // autumn
  hemanta: "হেমন্ত",    // late autumn
  sheet: "শীত",        // winter
  basanta: "বসন্ত",     // spring
};
