import { Suspense } from 'react'
import RankingContent from './ranking-content'
import RankingSkeleton from './ranking-skeleton'

export default function RankingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#0571e6] rounded-full" />
        <h1 className="text-2xl font-black text-[#020f2a]">知事ランキング</h1>
      </div>
      <Suspense fallback={<RankingSkeleton />}>
        <RankingContent />
      </Suspense>
    </div>
  )
}
