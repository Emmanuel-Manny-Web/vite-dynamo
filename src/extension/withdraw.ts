import { Schema, model } from "mongoose"

export interface IWithdraw {
  phone: string
  amount: number
  charge: number
  status: "Pending"| "Paid" | "Declined" | "Approved" | "Cancelled"
  mode: string
  createdAt: Date
  withdrawalID: string
  transfer_code: string
  reference: string
}

const withdrawSchema = new Schema<IWithdraw>({
  phone: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  charge: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "Pending"
  },
  mode: {
    type: String,
    required: true,
    default: "Naira Bank Transfer"
  },
  withdrawalID: {
    type: String
  },
  transfer_code: {
    type: String
  },
  reference: {
    type: String
  }
}, { timestamps: true })

export default withdrawSchema