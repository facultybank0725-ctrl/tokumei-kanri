import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Contract } from '@/models/Contract'
import { redirect } from 'next/navigation'

export default async function InvestorContracts() {
  const session = await auth()
  if (!session) redirect('/login')

  const investorId = (session.user as { investorId?: string }).investorId
  if (!investorId) redirect('/login')

  await connectDB()
  const contracts = await Contract.find({ investorId }).sort({ startDate: -1 }).lean()

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">契約情報</h1>

      <div className="space-y-4">
        {contracts.map((c) => (
          <div key={c._id.toString()} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-sm text-gray-500">{c.contractNumber}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[c.status]}`}>
                {statusLabel[c.status]}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">出資額</p>
                <p className="font-semibold">¥{c.investmentAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">分配比率</p>
                <p className="font-semibold">{c.profitRatio}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">開始日</p>
                <p className="font-semibold">{new Date(c.startDate).toLocaleDateString('ja-JP')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">終了日</p>
                <p className="font-semibold">{new Date(c.endDate).toLocaleDateString('ja-JP')}</p>
              </div>
            </div>
            {c.notes && (
              <p className="mt-4 text-xs text-gray-500 bg-gray-50 rounded p-3">{c.notes}</p>
            )}
          </div>
        ))}
        {contracts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
            契約情報がありません
          </div>
        )}
      </div>
    </div>
  )
}
