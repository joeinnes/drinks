export function stateInWords(bac: number) {
  if (bac > 0.2) return "Dangerous levels!";
  if (bac > 0.15) return "Severe impairment";
  if (bac > 0.1) return "Serious impairment";
  if (bac > 0.08) return "High impairment";
  if (bac > 0.04) return "Some impairment";
  if (bac > 0.02) return "Mild impairment";
  if (bac > 0) return "Minimal impairment";
  return "Sober";
}
