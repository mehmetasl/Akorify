'use client'

import { CHORD_DATA } from '@/lib/chord-db'

interface ChordBoxProps {
  chord: string
}

export default function ChordBox({ chord }: ChordBoxProps) {
  const frets = CHORD_DATA[chord]
  if (!frets) return null

  // --- 1. HESAPLAMA KISMI ---

  // Sadece basılan perdeleri (0 ve -1 hariç) al
  const activeFrets = frets.filter((f) => f > 0)

  // En küçük ve en büyük perdeyi bul
  const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 0
  const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 0

  // Başlangıç Perdesini Belirle (Base Fret)
  // Eğer akor 4. perdeyi geçiyorsa, başlangıcı kaydır (Bare mantığı)
  // Yoksa 1. perdeden başlat (Açık pozisyon)
  const baseFret = maxFret > 4 ? minFret : 1

  // SVG Ayarları
  const width = 100 // Genişliği artırdık (Yanda numara yazmak için)
  const height = 110
  const stringSpace = 14
  const fretSpace = 18
  const xOffset = 25 // Sol tarafta boşluk (Numara yazabiliriz diye)
  const yOffset = 25

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 text-lg font-bold">{chord}</span>

      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* A. Perde Numarası (Yan Tarafa) */}
        {baseFret > 1 && (
          <text
            x={xOffset - 8}
            y={yOffset + 12} // İlk aralığın ortası
            className="fill-primary text-xs font-bold"
            textAnchor="end"
          >
            {baseFret}fr
          </text>
        )}

        {/* B. Teller (Dikey) */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`string-${i}`}
            x1={xOffset + i * stringSpace}
            y1={yOffset}
            x2={xOffset + i * stringSpace}
            y2={yOffset + 5 * fretSpace} // Biraz daha uzun olsun
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300"
          />
        ))}

        {/* C. Perdeler (Yatay) */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`fret-${i}`}
            x1={xOffset}
            y1={yOffset + i * fretSpace}
            x2={xOffset + 5 * stringSpace}
            y2={yOffset + i * fretSpace}
            stroke="currentColor"
            // Eğer 1. perdeden başlıyorsak en üst çizgi kalın (Eşik/Nut) olur.
            // Ama bareliyse (baseFret > 1) normal çizgi olur.
            strokeWidth={i === 0 && baseFret === 1 ? '4' : '1'}
            className={i === 0 && baseFret === 1 ? 'text-foreground' : 'text-gray-300'}
          />
        ))}

        {/* D. Noktalar ve İşaretler */}
        {frets.map((fret, stringIndex) => {
          // 1. Tel Kapalı (X)
          if (fret === -1) {
            return (
              <text
                key={`mute-${stringIndex}`}
                x={xOffset + stringIndex * stringSpace}
                y={yOffset - 8}
                textAnchor="middle"
                className="fill-destructive text-[10px] font-bold" // Kırmızı X
              >
                ✕
              </text>
            )
          }

          // 2. Boş Tel (O) - Sadece bare yoksa çizilir
          if (fret === 0) {
            // Bareli pozisyonlarda 0 olmaz genelde ama yine de kontrol
            if (baseFret > 1) return null

            return (
              <circle
                key={`open-${stringIndex}`}
                cx={xOffset + stringIndex * stringSpace}
                cy={yOffset - 8}
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-muted-foreground"
              />
            )
          }

          // 3. Basılan Nokta (Dot)
          // Matematik: (Gerçek Perde - Başlangıç Perdesi) + 1
          // Örn: Cm (3. perde). Base=3.  (3-3)+1 = 1. aralık (Görsel olarak en üst)
          const relativeFret = fret - baseFret + 1

          // Eğer hesaplanan pozisyon kutu dışındaysa çizme (Güvenlik)
          if (relativeFret < 1 || relativeFret > 5) return null

          return (
            <circle
              key={`dot-${stringIndex}`}
              cx={xOffset + stringIndex * stringSpace}
              cy={yOffset + relativeFret * fretSpace - fretSpace / 2}
              r="5.5"
              className="fill-primary"
            />
          )
        })}
      </svg>
    </div>
  )
}
