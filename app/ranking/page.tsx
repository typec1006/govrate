import { Suspense } from 'react'
import RankingContent from './ranking-content'

function RankingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="w-12 h-8 bg-gray-200 rounded shrink-0" />
        </div>
      ))}
    </div>
  )
}

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
