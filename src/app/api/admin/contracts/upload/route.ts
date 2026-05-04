import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { connectDB } from '@/lib/mongodb'
import { Contract } from '@/models/Contract'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const contractId = formData.get('contractId') as string

  if (!file || !contractId) {
    return NextResponse.json({ error: 'ファイルと契約IDが必要です' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'PDFファイルのみアップロードできます' }, { status: 400 })
  }

  const blob = await put(`contracts/${contractId}/${file.name}`, file, {
    access: 'public',
  })

  await connectDB()
  await Contract.findByIdAndUpdate(contractId, { fileUrl: blob.url })

  return NextResponse.json({ url: blob.url })
}
