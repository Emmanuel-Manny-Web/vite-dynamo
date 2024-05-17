import "dotenv/config"
import express, { Request, Response } from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import Routes from "./routes/routes"

const app = express()

app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


app.use(Routes)
app.use('*', (req: Request, res: Response) => res.redirect('/404'))

mongoose.connect(process.env.DB_URI!)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err))

app.listen(process.env.PORT!, () => console.log("App running on port " + process.env.PORT!))