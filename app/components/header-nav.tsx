'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/vote', label: '投票' },
  { href: '/ranking', label: 'ランキング' },
]

export default function HeaderNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {tabs.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-1 text-sm font-bold transition-colors border-b-2 ${
            pathname.startsWith(href)
              ? 'text-white border-white'
              : 'text-blue-200 border-transparent hover:text-white hover:border-blue-300'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
