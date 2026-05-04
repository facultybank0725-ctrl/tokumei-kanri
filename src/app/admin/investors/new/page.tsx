'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewInvestorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    address: '',
    investmentAmount: '',
    email: '',
    password: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/investors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        investmentAmount: Number(form.investmentAmount),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || '登録に失敗しました')
      return
    }

    router.push('/admin/investors')
    router.refresh()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">出資者を追加</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="氏名" name="name" value={form.name} onChange={handleChange} required />
          <Field label="住所" name="address" value={form.address} onChange={handleChange} required />
          <Field label="出資額（円）" name="investmentAmount" type="number" value={form.investmentAmount} onChange={handleChange} required />
          <hr />
          <p className="text-xs text-gray-500">以下はログインアカウント情報です</p>
          <Field label="メールアドレス" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Field label="初期パスワード" name="password" type="password" value={form.password} onChange={handleChange} required />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label, name, type = 'text', value, onChange, required
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
