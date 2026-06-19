import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-20">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900">セッションが切れました</h1>
          <p className="text-sm text-gray-500">
            再度ログインしてください。
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          トップページへ
        </Link>
      </div>
    </div>
  )
}
