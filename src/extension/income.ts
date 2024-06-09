import { Schema, model } from "mongoose"

export interface IBalance {
  phone: string
  balance: number
}

const balanceSchema = new Schema<IBalance>({
  phone: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 200
  }
}, { timestamps: true })

export default balanceSchema