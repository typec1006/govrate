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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-7 bg-[#0571e6] rounded-full" />
        <h1 className="text-2xl font-black text-[#020f2a]">設定</h1>
      </div>

      {/* アカウント情報 */}
      <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200">
        <p className="text-xs font-bold uppercase tracking-wider mb-4 text-[#044a80]">アカウント</p>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} width={56} height={56} className="rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-600">
              {name[0] ?? 'U'}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>
      </div>

      {/* ログアウト */}
      <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200">
        <p className="text-xs font-bold uppercase tracking-wider mb-4 text-[#044a80]">セッション</p>
        <form action={signOut}>
          <button
            type="submit"
            className="px-5 py-2 rounded-full text-sm font-bold text-white bg-[#0571e6] transition-colors hover:bg-[#0a63c4] cursor-pointer"
          >
            ログアウト
          </button>
        </form>
      </div>

      {/* 退会 */}
      <div className="bg-white rounded-lg p-5 border border-red-200">
        <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[#c0392b]">退会</p>
        <p className="text-sm text-gray-500 mb-4">
          退会すると、すべての投票データが削除されます。
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  )
}
