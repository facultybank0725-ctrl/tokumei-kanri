import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Investor } from '@/models/Investor'
import { Distribution } from '@/models/Distribution'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const { totalAmount, distributionDate, description } = await req.json()

  if (!totalAmount || !distributionDate) {
    return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
  }

  await connectDB()
  const investors = await Investor.find().lean()

  if (investors.length === 0) {
    return NextResponse.json({ error: '出資者が登録されていません' }, { status: 400 })
  }

  const totalInvestment = investors.reduce((sum, i) => sum + i.investmentAmount, 0)

  const distributions = await Promise.all(
    investors.map((investor) => {
      const ratio = investor.investmentAmount / totalInvestment
      const amount = Math.floor(totalAmount * ratio)
      return Distribution.create({
        investorId: investor._id.toString(),
        amount,
        distributionDate: new Date(distributionDate),
        description: description || '',
      })
    })
  )

  return NextResponse.json({
    message: `${distributions.length}名分の分配金を登録しました`,
    distributions: distributions.map((d) => ({
      investorId: d.investorId,
      amount: d.amount,
    })),
  }, { status: 201 })
}
