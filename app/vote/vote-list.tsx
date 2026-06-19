'use client'
import { useState, useTransition } from 'react'
import { submitVote } from '@/app/lib/actions/vote'

const REGIONS = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州']

type Governor = {
  id: string
  prefecture: string
  name: string
  party: string
  region: string
}

type Props = {
  governors: Governor[]
  votes: Record<string, number>
}

type VoteStatus = 'all' | 'voted' | 'unvoted'

export default function VoteList({ governors, votes }: Props) {
  const [localVotes, setLocalVotes] = useState(votes)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [voteStatus, setVoteStatus] = useState<VoteStatus>('all')
  const [search, setSearch] = useState('')
  const [, startTransition] = useTransition()

  const filtered = governors.filter(g => {
    if (selectedRegion && g.region !== selectedRegion) return false
    if (search && !g.prefecture.includes(search) && !g.name.includes(search)) return false
    if (voteStatus === 'voted' && !localVotes[g.id]) return false
    if (voteStatus === 'unvoted' && localVotes[g.id]) return false
    return true
  })

  function handleVote(governorId: string, score: number) {
    setLocalVotes(prev => ({ ...prev, [governorId]: score }))
    startTransition(async () => {
      await submitVote(governorId, score)
    })
  }

  return (
    <div>
      <input
        type="text"
        placeholder="都道府県・知事名で検索"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm mb-4 outline-none focus:ring-2 focus:ring-[#0571e6]"
      />

      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
            !selectedRegion ? 'bg-[#044a80] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          すべて
        </button>
        {REGIONS.map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
              selectedRegion === region ? 'bg-[#044a80] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {([['all', 'すべて'], ['unvoted', '未投票'], ['voted', '投票済み']] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setVoteStatus(value)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
              voteStatus === value ? 'bg-[#0571e6] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(g => {
          const currentScore = localVotes[g.id]
          return (
            <div key={g.id} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#020f2a]">{g.name}</span>
                  <span className="text-sm text-[#5a5a5a]">{g.prefecture}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {g.party}
                  </span>
                  {currentScore && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                      投票済み
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleVote(g.id, score)}
                    className={`w-9 h-9 rounded-lg text-sm font-black transition-colors ${
                      currentScore === score
                        ? 'bg-[#044a80] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16">該当する知事が見つかりません</p>
        )}
      </div>
    </div>
  )
}
