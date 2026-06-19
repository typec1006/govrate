import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-black text-[#020f2a]">セッションが切れました</h1>
          <p className="text-sm text-gray-500">
            再度ログインしてください。
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#0571e6] text-white text-sm font-bold rounded-full hover:bg-[#0a63c4] transition-colors"
        >
          トップページへ
        </Link>
      </div>
    </div>
  )
}
