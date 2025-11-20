// lib/song-utils.ts
import { ChordSheetParser } from 'chordsheetjs';

/**
 * Şarkı içeriğini parse eder ve transpoze işlemi uygular.
 * Çıktıyı JSON uyumlu hale getirir (Next.js Server Component -> Client Component veri transferi için).
 */
export function parseSongLines(content: string, transposeStep: number = 0) {
  const parser = new ChordSheetParser({ 
    preserveWhitespace: true // Senin formatındaki boşlukları korur
  });
  
  let song = parser.parse(content);
  
  if (transposeStep !== 0) {
    song = song.transpose(transposeStep);
  }
  
  // Kıtaları (paragraphs) düzleştirip tek bir satır dizisine çeviriyoruz.
  // JSON.parse/stringify ile class metodlarını temizliyoruz.
  return JSON.parse(JSON.stringify(song.paragraphs.flatMap(p => p.lines)));
}