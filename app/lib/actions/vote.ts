'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitVote(governorId: string, score: number) {
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error('Invalid score')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.from('votes').upsert(
    {
      user_id: user.id,
      governor_id: governorId,
      score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,governor_id' }
  )

  revalidatePath('/ranking')
}
