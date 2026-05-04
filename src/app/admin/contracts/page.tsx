import { connectDB } from '@/lib/mongodb'
import { Contract } from '@/models/Contract'
import { Investor } from '@/models/Investor'
import ContractForm from './ContractForm'

export default async function ContractsPage() {
  await connectDB()
  const [contracts, investors] = await Promise.all([
    Contract.find().sort({ createdAt: -1 }).lean(),
    Investor.find().lean(),
  ])

  const investorMap = new Map(investors.map((i) => [i._id.toString(), i.name]))

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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">契約管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ContractForm investors={investors.map((i) => ({ id: i._id.toString(), name: i.name }))} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-base font-semibold text-gray-700">契約一覧</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left px-6 py-3 font-medium">契約番号</th>
                <th className="text-left px-6 py-3 font-medium">出資者</th>
                <th className="text-left px-6 py-3 font-medium">契約期間</th>
                <th className="text-right px-6 py-3 font-medium">出資額</th>
                <th className="text-center px-6 py-3 font-medium">状態</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs">{c.contractNumber}</td>
                  <td className="px-6 py-3">{investorMap.get(c.investorId) ?? '不明'}</td>
                  <td className="px-6 py-3 text-xs text-gray-600">
                    {new Date(c.startDate).toLocaleDateString('ja-JP')} 〜{' '}
                    {new Date(c.endDate).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-3 text-right">¥{c.investmentAmount.toLocaleString()}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">契約データがありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
