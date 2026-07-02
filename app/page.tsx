import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TopRankingContent, TopRankingSkeleton } from './top-ranking'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/vote')

  return (
    <div className="flex-1 bg-[#020f2a] text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* ヒーロータイトル */}
        <p className="text-[#0571e6] font-bold tracking-[0.3em] text-sm mb-3">GOVERNOR RANKING</p>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">知事レート</h1>
        <p className="text-gray-300 text-base mb-10">
          47都道府県の知事を1〜5点で評価・投票できるサービス
        </p>

        <Suspense fallback={<TopRankingSkeleton />}>
          <TopRankingContent />
        </Suspense>
      </div>
    </div>
  )
}
