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
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            pathname.startsWith(href)
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
