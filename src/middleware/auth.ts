import { verify, JwtPayload } from "jsonwebtoken"
import { Request, Response } from "express"
import User, { IUser } from "../model/user"
import Balance from "../model/balance"

const AuthCheck = async (req: Request, res: Response, next: Function) => {
  const token = req.cookies.pewd
  if (token) {
    const auth = verify(token, process.env.SECRET_ACCESS_TOKEN!) as JwtPayload
    if (auth) {
      const user = await User.findById(auth.id) as IUser
      const balance = await Balance.findOne({ email: user.email })
      res.locals.user = user
      res.locals.balance = balance
      next()
    } else {
      res.cookie("pewd", "")
      res.redirect("/login")
    }
  } else res.redirect('/login')
}

export { AuthCheck }