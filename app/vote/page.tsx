import { Suspense } from 'react'
import VoteContent from './vote-content'
import VoteSkeleton from './vote-skeleton'

export default function VotePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#0571e6] rounded-full" />
        <h1 className="text-2xl font-black text-[#020f2a]">投票</h1>
      </div>
      <Suspense fallback={<VoteSkeleton />}>
        <VoteContent />
      </Suspense>
    </div>
  )
}
