import { connectDB } from '@/lib/mongodb'
import { Investor } from '@/models/Investor'
import Link from 'next/link'

export default async function InvestorsPage() {
  await connectDB()
  const investors = await Investor.find().sort({ createdAt: -1 }).lean()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">出資者管理</h1>
        <Link
          href="/admin/investors/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + 出資者を追加
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left px-6 py-3 font-medium">氏名</th>
              <th className="text-left px-6 py-3 font-medium">住所</th>
              <th className="text-right px-6 py-3 font-medium">出資額</th>
              <th className="text-center px-6 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr key={investor._id.toString()} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{investor.name}</td>
                <td className="px-6 py-4 text-gray-600">{investor.address}</td>
                <td className="px-6 py-4 text-right">¥{investor.investmentAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/admin/investors/${investor._id.toString()}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    詳細・編集
                  </Link>
                </td>
              </tr>
            ))}
            {investors.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400">
                  出資者が登録されていません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
