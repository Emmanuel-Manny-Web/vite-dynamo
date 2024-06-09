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
    console.log(hash)
    console.log(req.headers["monnify-signature"])
    if (hash === req.headers['monnify-signature']) {
      const { transactionReference, paymentReference, amountPaid, customer } = req.body
      console.log(req.body)
      await (await connect).depositModel.findOneAndUpdate({ phone: customer.name, amount: amountPaid, paymentReference, transReference: transactionReference, status: "Pending" }, {
        status: "Approved"
      })
      await (await connect).balanceModel.findOneAndUpdate({ phone: customer.name }, {
        $inc: {
          balance: amountPaid
        }
      })
      res.status(200).json({ ok: true })
    } else {
      res.status(401).json({ ok: false, error: "Invalid hash/signature" })
    }
  }
}