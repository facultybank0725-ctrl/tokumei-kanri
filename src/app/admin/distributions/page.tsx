import { connectDB } from '@/lib/mongodb'
import { Distribution } from '@/models/Distribution'
import { Investor } from '@/models/Investor'
import DistributionForm from './DistributionForm'

export default async function DistributionsPage() {
  await connectDB()
  const [distributions, investors] = await Promise.all([
    Distribution.find().sort({ distributionDate: -1 }).lean(),
    Investor.find().lean(),
  ])

  const investorMap = new Map(investors.map((i) => [i._id.toString(), i.name]))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">分配金管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DistributionForm investors={investors.map((i) => ({ id: i._id.toString(), name: i.name }))} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-base font-semibold text-gray-700">分配金履歴</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left px-6 py-3 font-medium">出資者</th>
                <th className="text-left px-6 py-3 font-medium">分配日</th>
                <th className="text-right px-6 py-3 font-medium">金額</th>
                <th className="text-left px-6 py-3 font-medium">備考</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((d) => (
                <tr key={d._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{investorMap.get(d.investorId) ?? '不明'}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {new Date(d.distributionDate).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-3 text-right">¥{d.amount.toLocaleString()}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs">{d.description}</td>
                </tr>
              ))}
              {distributions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400">分配金データがありません</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
