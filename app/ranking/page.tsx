import { createClient } from '@/lib/supabase/server'
import { signInWithGoogle } from '@/app/lib/actions/auth'
import RankingList from './ranking-list'
import type { RankingRow } from './ranking-list'

export default async function RankingPage() {
  const supabase = await createClient()
  const [{ data: { user } }, { data: ranking }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('ranking').select('*'),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {!user && (
        <div className="mb-6 flex items-center justify-between gap-4 p-4 bg-[#e8f1fb] border border-[#bcd9f5] rounded-xl text-sm text-[#044a80]">
          <span className="font-medium">ログインすると知事に投票できます</span>
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="shrink-0 font-bold underline hover:no-underline"
            >
              Googleでログイン
            </button>
          </form>
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#0571e6] rounded-full" />
        <h1 className="text-2xl font-black text-[#020f2a]">知事ランキング</h1>
      </div>
      <RankingList initialData={(ranking ?? []) as RankingRow[]} />
    </div>
  )
}
