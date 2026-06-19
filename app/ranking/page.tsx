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
        <div className="mb-6 flex items-center justify-between gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
          <span>ログインすると知事に投票できます</span>
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="shrink-0 font-medium underline hover:no-underline"
            >
              Googleでログイン
            </button>
          </form>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">知事ランキング</h1>
      <RankingList initialData={(ranking ?? []) as RankingRow[]} />
    </div>
  )
}
