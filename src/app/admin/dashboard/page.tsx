import { connectDB } from '@/lib/mongodb'
import { Investor } from '@/models/Investor'
import { Distribution } from '@/models/Distribution'
import { Contract } from '@/models/Contract'

export default async function AdminDashboard() {
  await connectDB()

  const [investors, distributions, contracts] = await Promise.all([
    Investor.find().lean(),
    Distribution.find().lean(),
    Contract.find({ status: 'active' }).lean(),
  ])

  const totalInvestment = investors.reduce((sum, i) => sum + i.investmentAmount, 0)
  const totalDistribution = distributions.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard label="出資者数" value={`${investors.length} 名`} />
        <StatCard label="総出資額" value={`¥${totalInvestment.toLocaleString()}`} />
        <StatCard label="総分配金" value={`¥${totalDistribution.toLocaleString()}`} />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">出資者一覧</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left py-2 font-medium">氏名</th>
              <th className="text-left py-2 font-medium">住所</th>
              <th className="text-right py-2 font-medium">出資額</th>
              <th className="text-center py-2 font-medium">契約状況</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => {
              const hasContract = contracts.some((c) => c.investorId === investor._id.toString())
              return (
                <tr key={investor._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">{investor.name}</td>
                  <td className="py-3 text-gray-600 text-xs">{investor.address}</td>
                  <td className="py-3 text-right">¥{investor.investmentAmount.toLocaleString()}</td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${hasContract ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {hasContract ? '契約中' : '未契約'}
                    </span>
                  </td>
                </tr>
              )
            })}
            {investors.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">出資者が登録されていません</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
