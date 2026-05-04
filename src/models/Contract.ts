import { Schema, model, models } from 'mongoose'

export interface IContract {
  _id: string
  investorId: string
  contractNumber: string
  startDate: Date
  endDate: Date
  investmentAmount: number
  profitRatio: number
  status: 'active' | 'expired' | 'terminated'
  notes: string
  createdAt: Date
  updatedAt: Date
}

const ContractSchema = new Schema<IContract>(
  {
    investorId: { type: String, required: true },
    contractNumber: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    investmentAmount: { type: Number, required: true, min: 0 },
    profitRatio: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ['active', 'expired', 'terminated'], default: 'active' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

export const Contract = models.Contract || model<IContract>('Contract', ContractSchema)
