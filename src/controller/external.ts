import mongoose from "mongoose"
import Deposit from "../extension/deposit"
import Income from "../extension/income"
import Withdraw, { IWithdraw } from "../extension/withdraw"
import Notification from "../extension/notification"
import { Request, Response } from "express"
import { sha512 } from "js-sha512"
const connect = (async () => {

async function createConnection() {
  return await mongoose.createConnection(process.env.EXTERNAL_DB!).asPromise()
}

var conn = await createConnection()
var depositModel = conn.model('deposit', Deposit)
var balanceModel = conn.model('balance', Income)
var withdrawalModel = conn.model('withdrawal', Withdraw)
var notificationModel = conn.model('notification', Notification)

const computeHash = (body: any) => {
  const stringifiedBody = JSON.stringify(body)
  const result = sha512.hmac(process.env.MNFY_SECRET_KEY!, stringifiedBody)
  return result
}
  const verifyPaystackHash = (body: any) => {
  return sha512.hmac(process.env.PAYSTACK_SECRET_KEY!, JSON.stringify(body))
}
return { depositModel, balanceModel, withdrawalModel, notificationModel, computeHash, verifyPaystackHash }
})()

export default class Handler {
  static async mnfyWebHOOK(req: Request, res: Response) {
    const body = req.body
    const hash = (await connect).computeHash(body)
    if (hash === req.headers['monnify-signature']) {
      const { eventData, eventType } = req.body
      const { transactionReference, paymentReference, amountPaid, customer } = eventData
      console.log(eventData)
      if (eventType === 'SUCCESSFUL_TRANSACTION') {
        const deposit = await (await connect).depositModel.findOne({ phone: customer.name, amount: amountPaid, paymentReference, transReference: transactionReference, status: "Pending" })
        if (deposit !== null) {
         await (await connect).depositModel.findOneAndUpdate({ phone: customer.name, amount: amountPaid, paymentReference, transReference: transactionReference, status: "Pending" }, {
            status: "Approved"
          })
          await (await connect).balanceModel.findOneAndUpdate({ phone: customer.name }, {
            $inc: {
              balance: amountPaid
            }
          })
          console.log('true')
        }
      }
      res.status(200).json({ ok: true })
    } else {
      res.status(401).json({ ok: false, error: "Invalid hash/signature" })
    }
  }
  static async paystackWithdrawal(req: Request, res: Response) {
    const { data, event } = req.body
    console.log(data)
    const hash = (await connect).verifyPaystackHash(req.body)
    if (hash === req.headers['x-paystack-signature']) {
      if (event === 'transfer.success' && data.status === 'success') {
        await (await connect).withdrawalModel.findOneAndUpdate({ transfer_code: data.transfer_code, status: "Pending" }, { status: "Paid" })
      } else if (event === 'transfer.failed' && data.status === 'failed' || event === 'transfer.reversed' && data.status === 'reversed') {
        const withdrawal = await (await connect).withdrawalModel.findOne({ transfer_code: data.transfer_code }) as IWithdraw
        await (await connect).balanceModel.findOneAndUpdate({ phone: withdrawal.phone }, {
          $inc: {
            balance: data.amount + Math.floor(withdrawal.charge)
          }
        })
        await (await connect).withdrawalModel.findOneAndUpdate({ transfer_code: data.transfer_code, status: "Pending" }, { status: "Declined" })
        await (await connect).notificationModel.create({ phone: withdrawal.phone, message: `Refund for failed withdrawal`, amount: data.amount + withdrawal.charge })
      }
      res.status(200).json({ ok: true })
    } else {
      console.log('Hash does not match')
      res.status(200).json({ ok: false })
    }
  }
}