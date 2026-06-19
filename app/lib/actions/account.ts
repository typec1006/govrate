'use server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // votes → users の順に削除（外部キー制約のため）
  await supabase.from('votes').delete().eq('user_id', user.id)
  await supabase.from('users').delete().eq('id', user.id)

  // Supabase Auth からユーザー削除（Service Role Key 必須）
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await adminClient.auth.admin.deleteUser(user.id)

  // セッションクッキーをクリア
  await supabase.auth.signOut()

  redirect('/')
}
