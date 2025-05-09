// Widmark formula gender constant
const r = {
  female: 0.55,
  male: 0.68,
};

// The 'volume' here is the volume of pure alcohol, not the total volume of the drink
export function getBacAddition(
  volume: number,
  weight: number,
  gender: "male" | "female"
) {
  const alcoholDose = volume * 0.7893;
  return (alcoholDose / (weight * r[gender])) * 100;
}
