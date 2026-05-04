'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ContractDetailProps {
  contract: {
    id: string
    contractNumber: string
    investorName: string
    startDate: string
    endDate: string
    investmentAmount: number
    profitRatio: number
    status: string
    notes: string
    fileUrl?: string
  }
}

const statusLabel: Record<string, string> = {
  active: '契約中',
  expired: '満了',
  terminated: '解除',
}
const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-gray-100 text-gray-600',
  terminated: 'bg-red-100 text-red-600',
}

export default function ContractDetail({ contract }: ContractDetailProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [fileUrl, setFileUrl] = useState(contract.fileUrl)
  const [error, setError] = useState('')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('contractId', contract.id)

    const res = await fetch('/api/admin/contracts/upload', {
      method: 'POST',
      body: formData,
    })

    setUploading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'アップロードに失敗しました')
      return
    }

    const data = await res.json()
    setFileUrl(data.url)
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-sm text-gray-500">{contract.contractNumber}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[contract.status]}`}>
            {statusLabel[contract.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">出資者</p>
            <p className="font-semibold">{contract.investorName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">出資額</p>
            <p className="font-semibold">¥{contract.investmentAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">分配比率</p>
            <p className="font-semibold">{contract.profitRatio}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">契約期間</p>
            <p className="font-semibold text-xs">
              {new Date(contract.startDate).toLocaleDateString('ja-JP')} 〜{' '}
              {new Date(contract.endDate).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>

        {contract.notes && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
            {contract.notes}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">契約書PDF</h2>

        {fileUrl ? (
          <div className="space-y-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
            >
              <span>📄</span> 契約書を開く
            </a>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              ファイルを差し替える
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-sm mb-3">PDFファイルをアップロード</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {uploading ? 'アップロード中...' : 'ファイルを選択'}
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="hidden"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <Link href="/admin/contracts" className="inline-block text-sm text-gray-500 hover:text-gray-700">
        ← 契約一覧に戻る
      </Link>
    </div>
  )
}
