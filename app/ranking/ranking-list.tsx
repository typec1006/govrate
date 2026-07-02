'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type RankingRow = {
  id: string
  prefecture: string
  name: string
  party: string
  region: string
  avg_score: number | null
  vote_count: number
}

type SortKey = 'avg_score' | 'vote_count'

export default function RankingList({ initialData }: { initialData: RankingRow[] }) {
  const [ranking, setRanking] = useState(initialData)
  const [sortKey, setSortKey] = useState<SortKey>('avg_score')

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('votes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, async () => {
        const { data } = await supabase.from('ranking').select('*')
        if (data) setRanking(data as RankingRow[])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const sortedRanking = useMemo(() => {
    return [...ranking].sort((a, b) => {
      if (sortKey === 'vote_count') {
        return b.vote_count - a.vote_count
      }
      const scoreA = a.avg_score ?? -1
      const scoreB = b.avg_score ?? -1
      return scoreB - scoreA
    })
  }, [ranking, sortKey])

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'avg_score', label: '平均スコア順' },
    { key: 'vote_count', label: '投票数順' },
  ]

  const toggle = (
    <div className="flex gap-2 mb-4">
      {sortOptions.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={sortKey === option.key}
          onClick={() => setSortKey(option.key)}
          className={`px-4 py-1.5 text-sm font-bold rounded-full border transition-colors ${
            sortKey === option.key
              ? 'bg-[#044a80] border-[#044a80] text-white'
              : 'bg-white border-gray-200 text-gray-500 hover:border-[#044a80] hover:text-[#044a80]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )

  if (ranking.length === 0) {
    return (
      <>
        {toggle}
        <p className="text-center text-gray-400 py-16">データがありません</p>
      </>
    )
  }

  const medals = ['#d4af37', '#9ca3af', '#cd7f32']

  return (
    <div>
      {toggle}
      <div className="space-y-2">
        {sortedRanking.map((row, index) => {
          const isTop3 = index < 3
          return (
            <div
              key={row.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div
                className={`shrink-0 flex items-center justify-center font-black ${
                  isTop3
                    ? 'w-10 h-10 rounded-full text-white text-lg'
                    : 'w-10 text-center text-gray-300 text-base'
                }`}
                style={isTop3 ? { backgroundColor: medals[index] } : undefined}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#020f2a]">{row.name}</span>
                  <span className="text-sm text-[#5a5a5a]">{row.prefecture}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {row.party}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-[#044a80] leading-none">
                  {row.avg_score != null ? Number(row.avg_score).toFixed(1) : '—'}
                </div>
                <div className="text-xs text-gray-400 mt-1">{row.vote_count}票</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
