import { Request, Response } from "express"
import { sign, verify } from "jsonwebtoken"
import User from "../model/user"
import Balance from "../model/balance"

const createAccessToken = (id: string) => {
  return sign({ id }, process.env.SECRET_ACCESS_TOKEN!, {
    expiresIn: "7d"
  })
}

export default class API {
  static async getHome(req: Request, res: Response) {
    res.render('home', { title: "Vite Dynamo | Home" })
  }
  static async getLogin(req: Request, res: Response) {
    res.render('login', { title: "Vite Dynamo | Login" })
  }
  static async getRegister(req: Request, res: Response) {
    res.render('register', { title: "Vite Dynamo | Register" })
  }
  static async registerUser(req: Request, res: Response) {
    const body = req.body
    try {
      const user = await User.register(body)
      await Balance.create({ email: user.email })
      const token = createAccessToken(user._id)
      res.cookie('pewd', token, {
        maxAge: 60 * 60 * 24 * 1000
      })
      res.status(200).json({ ok: true, message: "Registered successfully" })
    } catch (err: any) {
      res.status(201).json({ ok: false, error: err.message })
    }
  }
  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      const user = await User.login(email, password)
      const token = createAccessToken(user._id)
      res.cookie('pewd', token, {
        maxAge: 60 * 60 * 24 * 1000
      })
      res.status(200).json({ ok: true, message: "Logged in successfully" })
    } catch (err: any) {
      res.status(201).json({ ok: false, error: err.message })
    }
  }
  static async logout(req: Request, res: Response) {
    res.cookie("pewd", "")
    res.redirect('/')
  }
  static async getUserDashboard(req: Request, res: Response) {
    res.render('clients/dashboard', { title: "Vite Dynamo | Dashboard" })
  }
  static async getUserTransaction(req: Request, res: Response) {
    res.render('clients/transactions', { title: "Vite Dynamo | Transactions" })
  }
  static async getUserAirtime(req: Request, res: Response) {
    res.render('clients/airtime', { title: "Vite Dynamo | Airtime" })
  }
  static async getDataBundle(req: Request, res: Response) {
    res.render('clients/data-bundle', { title: "Vite Dynamo | Data Bundle" })
  }
  static async getCableTV(req: Request, res: Response) {
    res.render('clients/cable-tv', { title: "Vite Dynamo | Cable Tv" })
  }
  static async getMeterToken(req: Request, res: Response) {
    res.render('clients/meter-token', { title: "Vite Dynamo | Meter Token" })
  }
  static async get404Page(req: Request, res: Response) {
    res.render('clients/404', { title: "Vite Dynamo | 404" })
  }
}