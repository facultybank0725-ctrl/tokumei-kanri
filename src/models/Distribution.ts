import { Schema, model, models } from 'mongoose'

export interface IDistribution {
  _id: string
  investorId: string
  amount: number
  distributionDate: Date
  description: string
  createdAt: Date
}

const DistributionSchema = new Schema<IDistribution>(
  {
    investorId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    distributionDate: { type: Date, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

export const Distribution = models.Distribution || model<IDistribution>('Distribution', DistributionSchema)
