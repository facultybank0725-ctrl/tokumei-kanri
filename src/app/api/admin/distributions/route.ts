import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Distribution } from '@/models/Distribution'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  await connectDB()
  const distributions = await Distribution.find().sort({ distributionDate: -1 }).lean()
  return NextResponse.json(distributions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const { investorId, amount, distributionDate, description } = await req.json()

  if (!investorId || !amount || !distributionDate) {
    return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
  }

  await connectDB()
  const distribution = await Distribution.create({
    investorId,
    amount: Number(amount),
    distributionDate: new Date(distributionDate),
    description: description || '',
  })

  return NextResponse.json(distribution, { status: 201 })
}
