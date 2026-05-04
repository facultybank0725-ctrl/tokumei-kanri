import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(req: NextRequest) {
  const { secret } = await req.json()

  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: '無効なシークレット' }, { status: 401 })
  }

  await connectDB()

  const existing = await User.findOne({ role: 'admin' })
  if (existing) {
    return NextResponse.json({ message: '管理者アカウントは既に存在します' })
  }

  const hashed = await bcrypt.hash('admin123456', 12)
  await User.create({
    email: 'admin@tokumei-kanri.com',
    password: hashed,
    role: 'admin',
    name: '管理者',
  })

  return NextResponse.json({ message: '管理者アカウントを作成しました', email: 'admin@tokumei-kanri.com', password: 'admin123456' })
}
