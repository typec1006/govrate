import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { signOut } from '@/app/lib/actions/auth'
import DeleteAccountButton from './delete-account-button'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/ranking')

  const name = user.user_metadata?.full_name ?? ''
  const email = user.email ?? ''
  const avatarUrl: string | undefined = user.user_metadata?.avatar_url

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">設定</h1>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} width={64} height={64} className="rounded-full" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl text-gray-600">
              {name[0] ?? 'U'}
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
        <h2 className="font-medium text-gray-900 mb-4">ログアウト</h2>
        <form action={signOut}>
          <button
            type="submit"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ログアウト
          </button>
        </form>
      </div>

      <div className="bg-white border border-red-100 rounded-xl p-6">
        <h2 className="font-medium text-red-600 mb-1">退会</h2>
        <p className="text-sm text-gray-500 mb-4">
          退会すると、すべての投票データが削除されます。
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  )
}
