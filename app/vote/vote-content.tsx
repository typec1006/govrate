import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/get-user'
import VoteList from './vote-list'

export default async function VoteContent() {
  const [user, supabase] = await Promise.all([getUser(), createClient()])

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

  return <VoteList governors={governors ?? []} votes={votesMap} />
}
