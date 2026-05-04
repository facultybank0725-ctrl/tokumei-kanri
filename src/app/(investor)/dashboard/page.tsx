import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Investor } from '@/models/Investor'
import { Distribution } from '@/models/Distribution'
import { Contract } from '@/models/Contract'
import { redirect } from 'next/navigation'

export default async function InvestorDashboard() {
  const session = await auth()
  if (!session) redirect('/login')

  const investorId = (session.user as { investorId?: string }).investorId
  if (!investorId) redirect('/login')

  await connectDB()
  const [investor, distributions, contracts] = await Promise.all([
    Investor.findById(investorId).lean(),
    Distribution.find({ investorId }).sort({ distributionDate: -1 }).limit(5).lean(),
    Contract.find({ investorId, status: 'active' }).lean(),
  ])

  if (!investor) redirect('/login')

  const totalDistribution = distributions.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ダッシュボード</h1>
      <p className="text-gray-500 text-sm mb-6">{investor.name} 様</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">出資額</p>
          <p className="text-2xl font-bold text-gray-800">¥{investor.investmentAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">受取分配金合計（直近5件）</p>
          <p className="text-2xl font-bold text-gray-800">¥{totalDistribution.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">契約中</p>
          <p className="text-2xl font-bold text-gray-800">{contracts.length} 件</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">直近の分配金</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left py-2 font-medium">分配日</th>
              <th className="text-right py-2 font-medium">金額</th>
              <th className="text-left py-2 font-medium">備考</th>
            </tr>
          </thead>
          <tbody>
            {distributions.map((d) => (
              <tr key={d._id.toString()} className="border-b last:border-0">
                <td className="py-3 text-gray-600">{new Date(d.distributionDate).toLocaleDateString('ja-JP')}</td>
                <td className="py-3 text-right font-medium">¥{d.amount.toLocaleString()}</td>
                <td className="py-3 text-gray-500 text-xs">{d.description}</td>
              </tr>
            ))}
            {distributions.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-gray-400">分配金の記録がありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
