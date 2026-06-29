import { Suspense } from 'react'
import Link from 'next/link'
import HeaderAuth from './header-auth'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#044a80]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-black text-lg tracking-tight text-white">知事レート</Link>
        <div className="flex items-center gap-3">
          <Suspense fallback={<div className="h-8 w-32 bg-white/20 rounded-full animate-pulse" />}>
            <HeaderAuth />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
