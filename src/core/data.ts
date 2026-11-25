// All constants and tables from the design.

/** Suffixes for formatted numbers, from million upwards. K is never used above a million. */
export const SUFFIXES = Object.freeze(["M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"] as const);

/** Thresholds for each suffix index. suffixes[i] applies at threshold[i]. */
export const THRESHOLDS = Object.freeze([1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33, 1e36] as const);
