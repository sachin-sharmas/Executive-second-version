/* All figures transcribed verbatim from the source deck. */

export const YEARS_11 = [
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "Total",
];

export type Row = { label: string; values: string[]; kind?: "group" | "total" | "pct" };

export const PL_2032: Row[] = [
  { label: "Revenue", values: [], kind: "group" },
  { label: "Aerivax", values: ["32", "33", "34", "34", "35", "33", "33", "32", "32", "32", "32", "363"] },
  { label: "Zevrina", values: ["2", "17", "19", "57", "97", "134", "162", "188", "213", "237", "255", "1,381"] },
  { label: "AVN-201", values: ["-", "-", "-", "-", "-", "17", "37", "50", "66", "84", "103", "357"] },
  { label: "GTx Total", values: ["-", "-", "-", "-", "6", "109", "678", "719", "1,170", "1,250", "1,309", "5,241"] },
  {
    label: "Total Net Sales",
    values: ["34", "50", "53", "92", "137", "293", "909", "989", "1,481", "1,603", "1,700", "7,341"],
    kind: "total",
  },
  {
    label: "Total COGS",
    values: ["-11", "-13", "-14", "-22", "-31", "-62", "-185", "-200", "-297", "-318", "-333", "-1,487"],
  },
  {
    label: "Gross margin",
    values: ["24", "37", "39", "70", "106", "231", "724", "789", "1,184", "1,285", "1,366", "5,855"],
  },
  {
    label: "Margin",
    values: ["69%", "74%", "73%", "76%", "78%", "79%", "80%", "80%", "80%", "80%", "80%", "80%"],
    kind: "pct",
  },
  { label: "G&A", values: ["19", "22", "25", "27", "30", "34", "35", "36", "36", "37", "37", "337"] },
  { label: "S&M", values: ["40", "45", "59", "68", "86", "134", "146", "149", "145", "146", "145", "1,163"] },
  { label: "R&D", values: ["28", "33", "42", "53", "63", "83", "87", "89", "91", "96", "98", "761"] },
  { label: "Tech Ops", values: ["3", "3", "3", "3", "3", "4", "4", "5", "5", "5", "5", "42"] },
  {
    label: "Total costs",
    values: ["89", "103", "129", "150", "183", "254", "273", "279", "277", "283", "285", "2,304"],
    kind: "total",
  },
  {
    label: "EBITDA",
    values: ["-65.3", "-66.2", "-89.7", "-80", "-76.2", "-23.0", "450.8", "510.2", "907.3", "1,001.9", "1,081.2", "3,551"],
    kind: "total",
  },
  {
    label: "as % of net sales",
    values: ["-191%", "-134%", "-168%", "-87%", "-56%", "-8%", "50%", "52%", "61%", "63%", "64%", "48%"],
    kind: "pct",
  },
  { label: "Functional costs % of Net Sales", values: [], kind: "group" },
  { label: "G&A", values: ["56%", "44%", "46%", "29%", "22%", "11%", "4%", "4%", "2%", "2%", "2%", "5%"], kind: "pct" },
  {
    label: "S&M",
    values: ["116%", "92%", "111%", "74%", "63%", "46%", "16%", "15%", "10%", "9%", "9%", "16%"],
    kind: "pct",
  },
  { label: "R&D", values: ["81%", "66%", "78%", "58%", "46%", "28%", "10%", "9%", "6%", "6%", "6%", "10%"], kind: "pct" },
  { label: "Tech Ops", values: ["8%", "6%", "6%", "3%", "2%", "1%", "0%", "0%", "0%", "0%", "0%", "1%"], kind: "pct" },
  {
    label: "Total",
    values: ["260%", "207%", "241%", "163%", "133%", "87%", "30%", "28%", "19%", "18%", "17%", "31%"],
    kind: "total",
  },
];

export const YEARS_10 = [
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
];

export const NET_SALES: Row[] = [
  { label: "Germany", values: ["$10", "$24", "$19", "$30", "$38", "$46", "$53", "$60", "$66", "$72"] },
  { label: "UK", values: ["7", "7", "9", "14", "20", "25", "33", "39", "49", "57"] },
  { label: "France", values: ["5", "5", "5", "5", "5", "4", "4", "4", "4", "4"] },
  { label: "Italy", values: ["2", "2", "3", "10", "18", "25", "25", "27", "31", "35"] },
  { label: "Spain", values: ["0", "0", "2", "10", "19", "26", "30", "34", "32", "32"] },
  { label: "All other countries", values: ["11", "12", "16", "23", "32", "40", "47", "55", "62", "69"] },
  {
    label: "Total EMEA",
    values: ["$34", "$50", "$53", "$92", "$132", "$167", "$194", "$220", "$245", "$269"],
    kind: "total",
  },
];

export const EBITDA_ROWS: Row[] = [
  { label: "Germany", values: ["($22)", "($20)", "($26)", "($14)", "($7)", "$10", "$18", "$26", "$34", "$39"] },
  { label: "UK", values: ["(3)", "(6)", "(8)", "(4)", "1", "2", "9", "16", "27", "34"] },
  { label: "France", values: ["(3)", "(4)", "(3)", "(2)", "(1)", "(1)", "(0)", "1", "1", "1"] },
  { label: "Italy", values: ["(6)", "(11)", "(15)", "(12)", "(6)", "3", "5", "7", "12", "16"] },
  { label: "Spain", values: ["(5)", "(7)", "(10)", "(4)", "3", "9", "12", "17", "16", "16"] },
  { label: "All other countries", values: ["(5)", "(6)", "(6)", "(2)", "4", "8", "15", "23", "29", "35"] },
  {
    label: "Total EMEA",
    values: ["($44)", "($53)", "($67)", "($38)", "($5)", "$31", "$58", "$90", "$120", "$141"],
    kind: "total",
  },
];

export const PRICING: Row[] = [
  { label: "Germany1", values: ["$9,360", "$9,360"] },
  { label: "UK", values: ["8,755", "6,511"] },
  { label: "Italy", values: ["7,605", "4,106"] },
  { label: "Spain", values: ["7,605", "5,780"] },
  { label: "Austria1", values: ["14,849", "9,360"] },
  { label: "Switzerland1", values: ["10,980", "10,980"] },
  { label: "Netherlands", values: ["8,775", "8,775"] },
  { label: "Portugal", values: ["8,775", "8,775"] },
  { label: "Average", values: ["$9,588", "$7,956"], kind: "total" },
];

export const CUM_PL_COLS = [
  "Current, FY27-30",
  "Global Support Only",
  "Product Supply & no promotion",
  "Product supply and promotion",
  "Product Supply & no promotion",
  "Product supply and promotion",
];

export const CUM_PL: Row[] = [
  { label: "Total Net Sales", values: ["190", "0", "111", "178", "111", "178"] },
  { label: "Total COGS", values: ["-53", "0", "-32", "-51", "-32", "-51"] },
  { label: "Gross Margin", values: ["137", "0", "79", "127", "79", "127"] },
  { label: "Margin", values: ["72%", "-", "71%", "71%", "71%", "71%"], kind: "pct" },
  { label: "Total OpEx", values: ["-377", "-98", "-143", "-185", "-46", "-87"] },
  { label: "EBITDA", values: ["-240", "-98", "-64", "-58", "33", "40"], kind: "total" },
  { label: "# FTEs", values: ["166", "51", "65", "90", "15", "40"] },
];

export const FTE_COLS = [
  "Currently",
  "Global support (no supply)",
  "Product supply (no promotion)",
  "Product supply & promotion",
];

export const FTES: Row[] = [
  { label: "Sales and Marketing", values: ["59", "0", "7", "28"] },
  { label: "Development", values: ["74", "36", "37", "40"] },
  { label: "Clinical Development", values: ["1", "1", "1", "1"] },
  { label: "Clinical Operations", values: ["13", "13", "13", "13"] },
  { label: "Drug Safety & PV", values: ["4", "2", "2", "2"] },
  { label: "Medical", values: ["34", "9", "9", "12"] },
  { label: "Program Management", values: ["2", "1", "1", "1"] },
  { label: "Quality Assurance", values: ["13", "6", "7", "7"] },
  { label: "Regulatory Affairs", values: ["7", "4", "4", "4"] },
  { label: "G&A", values: ["27", "12", "17", "18"] },
  { label: "TechOps (Logistics)", values: ["6", "3", "5", "5"] },
  { label: "Total", values: ["166", "51", "65", "90"], kind: "total" },
];

export const FTE_DELTAS = [
  { badge: "-115/-70%", detail: "Commercial -59, Medical -25, G&A -15, QA -7, Others -9" },
  { badge: "+15", detail: "Commercial +7, QA + Supply +3 G&A +5" },
  { badge: "+25", detail: "Commercial +21, Medical +3, G&A +1" },
];
