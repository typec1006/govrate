import { createClient } from '@/lib/supabase/server'
import VoteList from './vote-list'

export default async function VotePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: governors }, { data: votes }] = await Promise.all([
    supabase.from('governors').select('id, prefecture, name, party, region').order('prefecture'),
    user
      ? supabase.from('votes').select('governor_id, score').eq('user_id', user.id)
      : Promise.resolve({ data: [] }),
  ])

  const votesMap: Record<string, number> = {}
  for (const v of votes ?? []) {
    votesMap[v.governor_id] = v.score
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-7 bg-[#0571e6] rounded-full" />
        <h1 className="text-2xl font-black text-[#020f2a]">投票</h1>
      </div>
      <VoteList governors={governors ?? []} votes={votesMap} />
    </div>
  )
}
