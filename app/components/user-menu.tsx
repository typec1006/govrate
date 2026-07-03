'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from '@/app/lib/actions/auth'

interface Props {
  avatarUrl?: string
  name?: string
}

export default function UserMenu({ avatarUrl, name }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/40 hover:ring-2 hover:ring-white/60 transition-all cursor-pointer"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name ?? 'ユーザー'} width={32} height={32} />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
            {name?.[0] ?? 'U'}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            設定
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              ログアウト
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
