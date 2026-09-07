/**
 * Utility to convert English digits (0-9) to Hindi Devanagari numerals (०-९)
 */
export const toHindiNumber = (val) => {
  if (val === null || val === undefined) return "";
  const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(val).replace(/[0-9]/g, (d) => hindiDigits[Number(d)]);
};

export default toHindiNumber;
