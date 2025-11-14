'use client'

import { useEffect, useState } from 'react'

interface AdSlotProps {
  adSlot?: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  className?: string
}

export default function AdSlot({ adSlot, adFormat = 'auto', className }: AdSlotProps) {
  const [mounted, setMounted] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    setMounted(true)

    // Google AdSense initialization
    if (clientId && typeof window !== 'undefined') {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle"]')) {
        const script = document.createElement('script')
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
        script.async = true
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }

      // Initialize ad after a short delay to ensure script is loaded
      const timer = setTimeout(() => {
        try {
          if ((window as any).adsbygoogle) {
            ;(window as any).adsbygoogle.push({})
          }
        } catch (err) {
          console.error('AdSense error:', err)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [clientId])

  // Server-side render: always show placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`my-8 flex min-h-[100px] items-center justify-center border-2 border-dashed border-muted bg-muted/20 ${className || ''}`}
        suppressHydrationWarning
      >
        <p className="text-xs text-muted-foreground">Ad Slot Placeholder</p>
      </div>
    )
  }

  // Client-side render: show actual ad if client ID exists
  if (!clientId) {
    return (
      <div
        className={`my-8 flex min-h-[100px] items-center justify-center border-2 border-dashed border-muted bg-muted/20 ${className || ''}`}
      >
        <p className="text-xs text-muted-foreground">Ad Slot Placeholder</p>
      </div>
    )
  }

  return (
    <div className={`my-8 ${className || ''}`} suppressHydrationWarning>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

