import { connectDB } from '@/lib/mongodb'
import { Contract } from '@/models/Contract'
import { Investor } from '@/models/Investor'
import { notFound } from 'next/navigation'
import ContractDetail from './ContractDetail'

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()

  const [contract, investors] = await Promise.all([
    Contract.findById(id).lean(),
    Investor.find().lean(),
  ])

  if (!contract) notFound()

  const investor = investors.find((i) => i._id.toString() === contract.investorId)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">契約詳細</h1>
      <ContractDetail
        contract={{
          id: contract._id.toString(),
          contractNumber: contract.contractNumber,
          investorName: investor?.name ?? '不明',
          startDate: contract.startDate.toISOString(),
          endDate: contract.endDate.toISOString(),
          investmentAmount: contract.investmentAmount,
          profitRatio: contract.profitRatio,
          status: contract.status,
          notes: contract.notes,
          fileUrl: contract.fileUrl,
        }}
      />
    </div>
  )
}
