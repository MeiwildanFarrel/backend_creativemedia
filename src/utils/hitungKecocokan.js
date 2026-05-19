const LEVEL_PENDIDIKAN = {
  'sd': 1,
  'smp': 2,
  'sma': 3, 'smk': 3,
  'd3': 4, 'd4': 4,
  's1': 5,
  's2': 6,
  's3': 7
};

const getLevelPendidikan = (teks) => {
  if (!teks) return 3;
  const lower = teks.toLowerCase();
  for (const [kunci, level] of Object.entries(LEVEL_PENDIDIKAN)) {
    if (lower.includes(kunci)) return level;
  }
  return 3;
};

const hitungKecocokan = (profilPelamar, lowongan) => {
  let skor = 0;

  // Keahlian (40%)
  if (!lowongan.keahlian_dibutuhkan) {
    skor += 40;
  } else {
    const keahlianDibutuhkan = lowongan.keahlian_dibutuhkan
      .split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    const keahlianPelamar = (profilPelamar.keahlian || '')
      .split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    if (keahlianDibutuhkan.length === 0) {
      skor += 40;
    } else {
      const cocok = keahlianDibutuhkan.filter(k => keahlianPelamar.includes(k)).length;
      skor += (cocok / keahlianDibutuhkan.length) * 40;
    }
  }

  // Pengalaman (30%)
  const pengalamanPelamar    = parseInt(profilPelamar.pengalaman || '', 10);
  const pengalamanDibutuhkan = Number(lowongan.pengalaman_dibutuhkan) || 0;
  if (isNaN(pengalamanPelamar)) {
    // skor += 0
  } else if (pengalamanPelamar >= pengalamanDibutuhkan) {
    skor += 30;
  } else {
    skor += pengalamanDibutuhkan > 0 ? (pengalamanPelamar / pengalamanDibutuhkan) * 30 : 30;
  }

  // Pendidikan (20%)
  const levelPelamar    = getLevelPendidikan(profilPelamar.pendidikan);
  const levelDibutuhkan = getLevelPendidikan(lowongan.pendidikan_dibutuhkan);
  if (levelPelamar >= levelDibutuhkan) skor += 20;

  // Lokasi (10%)
  const lokasiPelamar  = (profilPelamar.lokasi || '').toLowerCase();
  const lokasiLowongan = (lowongan.lokasi || '').toLowerCase();
  if (lokasiPelamar && lokasiLowongan &&
      (lokasiPelamar.includes(lokasiLowongan) || lokasiLowongan.includes(lokasiPelamar))) {
    skor += 10;
  }

  return Math.round(skor * 100) / 100;
};

module.exports = hitungKecocokan;
