// Widmark formula gender constant
const r = {
	f: 0.55,
	m: 0.68
};

/**
 *   @param {number} volume
 *   @param {number} storeWeight
 *   @param {'m'|'f'} storeGender */

const calculateBacAddition = (volume, storeWeight, storeGender) => {
	const alcoholDose = volume * 0.7893; // 0.789 is alcohol's weight:volume ratio
	return (alcoholDose / (storeWeight * r[storeGender])) * 100;
};

export { calculateBacAddition };
