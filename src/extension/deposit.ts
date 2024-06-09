import { Schema, model } from "mongoose"

export interface IDeposit {
  amount: number
  narration: string
  status: "Pending" | "Approved" | "Declined"
  email: string
  phone: string
  method: string
  createdAt: Date
  transactionID: number
  paymentReference: string
  transReference: string
  outTradeNo: string
}

const depositSchema = new Schema<IDeposit>({
  amount: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  narration: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "Pending"
  },
  email: {
    type: String,
    required: true,
    default: "Jondoe@gmail.com"
  },
  method: {
    type: String,
    required: true,
    default: "Bank Transfer"
  },
  transactionID: {
    type: Number
  },
  paymentReference: {
    type: String
  },
  transReference: {
    type: String
  },
  outTradeNo: {
    type: String
  }
}, { timestamps: true })

export default depositSchema