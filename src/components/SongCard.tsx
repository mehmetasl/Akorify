import Link from 'next/link'
import { Music } from 'lucide-react'

interface SongCardProps {
  title: string
  artist: string
  slug: string
}

export default function SongCard({ title, artist, slug }: SongCardProps) {
  return (
    <Link
      href={`/songs/${slug}`}
      className="group block rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      <div className="flex items-start space-x-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
          <Music className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-secondary transition-colors">{artist}</p>
        </div>
      </div>
    </Link>
  )
}

