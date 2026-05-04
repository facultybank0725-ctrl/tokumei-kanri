import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Distribution } from '@/models/Distribution'
import { redirect } from 'next/navigation'

export default async function InvestorDistributions() {
  const session = await auth()
  if (!session) redirect('/login')

  const investorId = (session.user as { investorId?: string }).investorId
  if (!investorId) redirect('/login')

  await connectDB()
  const distributions = await Distribution.find({ investorId }).sort({ distributionDate: -1 }).lean()

  const total = distributions.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">分配金履歴</h1>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 inline-block">
        <p className="text-xs text-gray-500 mb-1">受取分配金合計</p>
        <p className="text-2xl font-bold text-gray-800">¥{total.toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left px-6 py-3 font-medium">分配日</th>
              <th className="text-right px-6 py-3 font-medium">金額</th>
              <th className="text-left px-6 py-3 font-medium">備考</th>
            </tr>
          </thead>
          <tbody>
            {distributions.map((d) => (
              <tr key={d._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-3">{new Date(d.distributionDate).toLocaleDateString('ja-JP')}</td>
                <td className="px-6 py-3 text-right font-medium">¥{d.amount.toLocaleString()}</td>
                <td className="px-6 py-3 text-gray-500 text-xs">{d.description}</td>
              </tr>
            ))}
            {distributions.length === 0 && (
              <tr><td colSpan={3} className="py-12 text-center text-gray-400">分配金の記録がありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
