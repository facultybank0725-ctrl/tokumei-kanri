import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  _id: string
  email: string
  password: string
  role: 'admin' | 'investor'
  investorId?: string
  name: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'investor'], default: 'investor' },
    investorId: { type: String },
    name: { type: String, required: true },
  },
  { timestamps: true }
)

export const User = models.User || model<IUser>('User', UserSchema)
