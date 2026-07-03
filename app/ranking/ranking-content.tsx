import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/get-user'
import { signInWithGoogle } from '@/app/lib/actions/auth'
import RankingList from './ranking-list'
import type { RankingRow } from './ranking-list'

export default async function RankingContent() {
  const [user, supabase] = await Promise.all([getUser(), createClient()])
  const { data: ranking } = await supabase.from('ranking').select('*')

  return (
    <>
      {!user && (
        <div className="mb-6 flex items-center justify-between gap-4 p-4 bg-[#e8f1fb] border border-[#bcd9f5] rounded-xl text-sm text-[#044a80]">
          <span className="font-medium">ログインすると知事に投票できます</span>
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="shrink-0 font-bold underline hover:no-underline cursor-pointer"
            >
              Googleでログイン
            </button>
          </form>
        </div>
      )}
      <RankingList initialData={(ranking ?? []) as RankingRow[]} />
    </>
  )
}
