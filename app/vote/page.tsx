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
      <h1 className="text-2xl font-bold mb-6">投票</h1>
      <VoteList governors={governors ?? []} votes={votesMap} />
    </div>
  )
}
