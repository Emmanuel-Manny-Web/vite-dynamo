import { Schema, model } from "mongoose"
import isEmail from "validator/lib/isEmail"

export interface IBalance {
  email: string
  amount: number
}

const balanceSchema = new Schema<IBalance>({
  email: {
    type: String,
    required: [true, 'An email address'],
    validate: [isEmail, 'Provide a valid email address']
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true })

export default model<IBalance>('balance', balanceSchema)