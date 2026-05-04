import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Contract } from '@/models/Contract'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  await connectDB()
  const contracts = await Contract.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(contracts)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const { investorId, contractNumber, startDate, endDate, investmentAmount, profitRatio, notes } = await req.json()

  if (!investorId || !contractNumber || !startDate || !endDate || !investmentAmount || profitRatio === undefined) {
    return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
  }

  await connectDB()

  const existing = await Contract.findOne({ contractNumber })
  if (existing) {
    return NextResponse.json({ error: 'この契約番号は既に使用されています' }, { status: 400 })
  }

  const contract = await Contract.create({
    investorId,
    contractNumber,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    investmentAmount: Number(investmentAmount),
    profitRatio: Number(profitRatio),
    notes: notes || '',
  })

  return NextResponse.json(contract, { status: 201 })
}
