import { Schema, model, models } from 'mongoose'

export interface IInvestor {
  _id: string
  name: string
  address: string
  investmentAmount: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

const InvestorSchema = new Schema<IInvestor>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    investmentAmount: { type: Number, required: true, min: 0 },
    userId: { type: String },
  },
  { timestamps: true }
)

export const Investor = models.Investor || model<IInvestor>('Investor', InvestorSchema)
