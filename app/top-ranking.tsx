import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function TopRankingContent() {
  const supabase = await createClient()
  const { data: ranking } = await supabase
    .from('ranking')
    .select('id, prefecture, name, avg_score, vote_count')
    .limit(5)

  if (!ranking || ranking.length === 0) return null

  const medals = ['#d4af37', '#9ca3af', '#cd7f32']

  return (
    <div className="mt-14 w-full max-w-lg mx-auto">
      <h2 className="text-sm font-bold tracking-[0.2em] text-[#0571e6] mb-4">TOP 5 RANKING</h2>
      <div className="space-y-2">
        {ranking.map((row, index) => {
          const isTop3 = index < 3
          return (
            <div
              key={row.id}
              className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
            >
              <div
                className={`shrink-0 flex items-center justify-center font-black text-sm ${
                  isTop3
                    ? 'w-7 h-7 rounded-full text-white'
                    : 'w-7 text-center text-gray-500'
                }`}
                style={isTop3 ? { backgroundColor: medals[index] } : undefined}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className="font-bold text-sm text-white truncate">{row.name}</span>
                <span className="text-xs text-gray-400 shrink-0">{row.prefecture}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-black text-[#0571e6]">
                  {row.avg_score != null ? Number(row.avg_score).toFixed(1) : '—'}
                </span>
                <span className="text-xs text-gray-500 ml-1">{row.vote_count}票</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-center">
        <Link href="/ranking" className="text-sm text-[#0571e6] hover:underline font-medium">
          ランキング全体を見る →
        </Link>
      </div>
    </div>
  )
}

export function TopRankingSkeleton() {
  return (
    <div className="mt-14 w-full max-w-lg mx-auto animate-pulse">
      <div className="h-4 w-32 bg-white/10 rounded mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
