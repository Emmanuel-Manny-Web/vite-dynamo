import { Schema, model } from "mongoose"

interface INotification {
  phone: string
  message: string
  amount: number
  createdAt: number
}

const notificationSchema = new Schema<INotification>({
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  amount: {
    type: Number
  }
}, { timestamps: true })


export default notificationSchema