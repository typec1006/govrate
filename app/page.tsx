import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signInWithGoogle } from '@/app/lib/actions/auth'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/vote')

  return (
    <div className="flex-1 bg-[#020f2a] text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* ヒーロータイトル */}
        <p className="text-[#0571e6] font-bold tracking-[0.3em] text-sm mb-3">GOVERNOR RANKING</p>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">知事レート</h1>
        <p className="text-gray-300 text-base mb-10">
          47都道府県の知事を1〜5点で評価・投票できるサービス
        </p>

        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { value: '47', label: '都道府県' },
            { value: '1〜5', label: '点で評価' },
            { value: '匿名', label: 'で投票' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-lg py-5 px-2">
              <div className="text-3xl font-black text-[#044a80] mb-1">{value}</div>
              <div className="text-xs text-[#5a5a5a] font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* ログインボタン */}
        <form action={signInWithGoogle} className="flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0571e6] hover:bg-[#0a63c4] text-white text-base font-bold transition-colors"
          >
            <span className="bg-white rounded-full w-6 h-6 inline-flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </span>
            Googleでログイン
          </button>
        </form>

        <p className="text-xs mt-5 text-gray-400">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなします
        </p>
      </div>
    </div>
  )
}
