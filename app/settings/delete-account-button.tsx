'use client'
import { useState, useTransition } from 'react'
import { deleteAccount } from '@/app/lib/actions/account'

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteAccount()
    })
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
      >
        退会する
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-red-600">本当に退会しますか？この操作は取り消せません。</p>
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {pending ? '処理中...' : '退会する'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}
