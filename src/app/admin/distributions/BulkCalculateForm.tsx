'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BulkCalculateForm({ investorCount }: { investorCount: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    totalAmount: '',
    distributionDate: '',
    description: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/admin/distributions/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, totalAmount: Number(form.totalAmount) }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || '計算に失敗しました')
      return
    }

    const data = await res.json()
    setSuccess(data.message)
    setForm({ totalAmount: '', distributionDate: '', description: '' })
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-100">
      <h2 className="text-base font-semibold text-gray-700 mb-1">一括自動計算</h2>
      <p className="text-xs text-gray-500 mb-4">
        合計分配金額を入力すると、出資額の比率に応じて{investorCount}名分を自動計算して登録します
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">合計分配金額（円）</label>
          <input
            type="number"
            name="totalAmount"
            value={form.totalAmount}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: 1000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分配日</label>
          <input
            type="date"
            name="distributionDate"
            value={form.distributionDate}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: 第1期分配金"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm disabled:opacity-50 font-medium"
        >
          {loading ? '計算・登録中...' : '自動計算して一括登録'}
        </button>
      </form>
    </div>
  )
}
