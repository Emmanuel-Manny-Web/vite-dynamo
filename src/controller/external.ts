import mongoose from "mongoose"
import Deposit from "../extension/deposit"
import Income from "../extension/income"
import { Request, Response } from "express"
import { sha512 } from "js-sha512"
const connect = (async () => {

async function createConnection() {
  return await mongoose.createConnection(process.env.EXTERNAL_DB!).asPromise()
}

var conn = await createConnection()
var depositModel = conn.model('deposit', Deposit)
var balanceModel = conn.model('balance', Income)

const computeHash = (body: any) => {
  const stringifiedBody = JSON.stringify(body)
  const result = sha512.hmac(process.env.MNFY_SECRET_KEY!, stringifiedBody)
  return result
}
return { depositModel, balanceModel, computeHash }
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
}