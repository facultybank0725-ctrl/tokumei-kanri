import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { Investor } from '@/models/Investor'
import { User } from '@/models/User'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  await connectDB()
  const investors = await Investor.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(investors)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const { name, address, investmentAmount, email, password } = await req.json()

  if (!name || !address || !investmentAmount || !email || !password) {
    return NextResponse.json({ error: '全項目を入力してください' }, { status: 400 })
  }

  await connectDB()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ error: 'このメールアドレスは既に使用されています' }, { status: 400 })
  }

  const investor = await Investor.create({ name, address, investmentAmount })

  const hashed = await bcrypt.hash(password, 12)
  await User.create({
    email,
    password: hashed,
    role: 'investor',
    name,
    investorId: investor._id.toString(),
  })

  return NextResponse.json(investor, { status: 201 })
}
