// [Kalın tel (E) ... İnce tel (e)]
// -1: Tel Kapalı (X), 0: Boş Tel (O), 1-12: Perde numarası

export const CHORD_DATA: Record<string, number[]> = {
  // --- C (Do) Ailesi ---
  "C":      [-1, 3, 2, 0, 1, 0],
  "Cm":     [-1, 3, 5, 5, 4, 3], // Barre 3
  "C7":     [-1, 3, 2, 3, 1, 0],
  "Cmaj7":  [-1, 3, 2, 0, 0, 0],
  "Csus4":  [-1, 3, 3, 0, 1, 1], // F/C şekli
  "Cadd9":  [-1, 3, 2, 0, 3, 0],

  // --- C# / Db Ailesi ---
  "C#":     [-1, 4, 6, 6, 6, 4], // Barre 4
  "Db":     [-1, 4, 6, 6, 6, 4], 
  "C#m":    [-1, 4, 6, 6, 5, 4], // Barre 4 (Meşhur Akor)
  "Dbm":    [-1, 4, 6, 6, 5, 4],
  "C#7":    [-1, 4, 6, 4, 6, 4],
  "C#m7":   [-1, 4, 6, 4, 5, 4],

  // --- D (Re) Ailesi ---
  "D":      [-1, -1, 0, 2, 3, 2],
  "Dm":     [-1, -1, 0, 2, 3, 1],
  "D7":     [-1, -1, 0, 2, 1, 2],
  "Dmaj7":  [-1, -1, 0, 2, 2, 2],
  "Dsus2":  [-1, -1, 0, 2, 3, 0],
  "Dsus4":  [-1, -1, 0, 2, 3, 3],
  "Dm7":    [-1, -1, 0, 2, 1, 1],

  // --- D# / Eb Ailesi ---
  "D#":     [-1, 6, 8, 8, 8, 6], // Barre 6
  "Eb":     [-1, 6, 8, 8, 8, 6],
  "D#m":    [-1, 6, 8, 8, 7, 6],
  "Ebm":    [-1, 6, 8, 8, 7, 6],
  "Eb7":    [-1, 6, 8, 6, 8, 6],

  // --- E (Mi) Ailesi ---
  "E":      [0, 2, 2, 1, 0, 0],
  "Em":     [0, 2, 2, 0, 0, 0],
  "E7":     [0, 2, 0, 1, 0, 0],
  "Emaj7":  [0, 2, 1, 1, 0, 0],
  "Esus4":  [0, 2, 2, 2, 0, 0],
  "Em7":    [0, 2, 2, 0, 3, 0], // Veya [0, 2, 0, 0, 0, 0]

  // --- F (Fa) Ailesi ---
  "F":      [1, 3, 3, 2, 1, 1], // Barre 1
  "Fm":     [1, 3, 3, 1, 1, 1], 
  "F7":     [1, 3, 1, 2, 1, 1],
  "Fmaj7":  [-1, -1, 3, 2, 1, 0], // Kolay Fmaj7
  "F#":     [2, 4, 4, 3, 2, 2],   // Barre 2
  "Gb":     [2, 4, 4, 3, 2, 2],
  "F#m":    [2, 4, 4, 2, 2, 2],   // Meşhur F#m
  "Gbm":    [2, 4, 4, 2, 2, 2],
  "F#7":    [2, 4, 2, 3, 2, 2],
  "F#m7":   [2, 4, 2, 2, 2, 2],

  // --- G (Sol) Ailesi ---
  "G":      [3, 2, 0, 0, 0, 3], // Veya [3, 2, 0, 0, 3, 3]
  "Gm":     [3, 5, 5, 3, 3, 3], // Barre 3
  "G7":     [3, 2, 0, 0, 0, 1],
  "Gmaj7":  [3, 2, 0, 0, 0, 2],
  "Gsus4":  [3, 2, 0, 0, 1, 3],
  "G#":     [4, 6, 6, 5, 4, 4], // Barre 4
  "Ab":     [4, 6, 6, 5, 4, 4],
  "G#m":    [4, 6, 6, 4, 4, 4],
  "Abm":    [4, 6, 6, 4, 4, 4],

  // --- A (La) Ailesi ---
  "A":      [-1, 0, 2, 2, 2, 0],
  "Am":     [-1, 0, 2, 2, 1, 0],
  "A7":     [-1, 0, 2, 0, 2, 0],
  "Amaj7":  [-1, 0, 2, 1, 2, 0],
  "Asus2":  [-1, 0, 2, 2, 0, 0],
  "Asus4":  [-1, 0, 2, 2, 3, 0],
  "Am7":    [-1, 0, 2, 0, 1, 0],
  "A#":     [-1, 1, 3, 3, 3, 1], // Barre 1 (A shape)
  "Bb":     [-1, 1, 3, 3, 3, 1],
  "A#m":    [-1, 1, 3, 3, 2, 1],
  "Bbm":    [-1, 1, 3, 3, 2, 1],

  // --- B (Si) Ailesi ---
  "B":      [-1, 2, 4, 4, 4, 2], // Barre 2
  "Bm":     [-1, 2, 4, 4, 3, 2],
  "B7":     [-1, 2, 1, 2, 0, 2],
  "Bmaj7":  [-1, 2, 4, 3, 4, 2],
  "Bm7":    [-1, 2, 0, 2, 0, 2], // Veya barre: [-1, 2, 4, 2, 3, 2]
    "Fb":     [0, 2, 2, 1, 0, 0],
  "Fbm":    [0, 2, 2, 0, 0, 0], 
  // Cb -> B
  "Cb":     [-1, 2, 4, 4, 4, 2],
  "Cbm":    [-1, 2, 4, 4, 3, 2],
  // B# -> C
  "B#":     [-1, 3, 2, 0, 1, 0],
  "B#m":    [-1, 3, 5, 5, 4, 3],
  // E# -> F
  "E#":     [1, 3, 3, 2, 1, 1],
  "E#m":    [1, 3, 3, 1, 1, 1],
};

// Şarkı metninden benzersiz akorları bulan fonksiyon
export function extractUniqueChords(content: string): string[] {
  // 1. Regex ile akorları bul
  const chordRegex = /\b[A-G][#b]?(?:m|maj|dim|aug|sus|add|7|9|11|13)*\b/g;
  const matches = content.match(chordRegex) || [];
  
  // 2. Slash akorları temizle (Örn: D/F# -> D olarak alalım ki çizim bulunsun)
  // Eğer slash akor çizimi yoksa kökünü gösteririz.
  const cleanedMatches = matches.map(chord => {
    if (chord.includes('/')) {
      return chord.split('/')[0];
    }
    return chord;
  });

  // 3. Tekilleştir ve sırala
  return Array.from(new Set(cleanedMatches)).sort();
}