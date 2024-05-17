import { compareSync, genSaltSync, hashSync } from "bcryptjs"
import { Schema, model, Model } from "mongoose"
import isEmail from "validator/lib/isEmail"

export interface IUser {
  name: string
  phone: string
  _id: string
  email: string
  password: string
  pin: string
}

interface IUserModel extends Model<IUser> {
  login(email: string, password: string): Promise<IUser>
  register(body: IUser): Promise<IUser>
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: [true, 'A name must be provided']
  },
  phone: {
    type: String,
    required: [true, 'A phone number must be provided']
  },
  email: {
    type: String,
    required: [true, 'An email address must be provided'],
    validate: [isEmail, 'Provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Provide a password']
  },
  pin: {
    type: String,
    required: [true, 'Provide a pin for your account'],
    maxlength: [4, 'Maximum length of 4 characters'],
    minlength: [4, 'Mminimum length of 4 characters']
  }
}, { timestamps: true })

userSchema.statics.login = async function (email: string, password: string) {
  const user = await this.findOne({ email })
  if (user) {
    const verify = compareSync(password, user.password)
    if (verify) return user
    else throw Error("Invalid email or password")
  } else throw Error("User does not exist")
}

userSchema.statics.register = async function (body: IUser): Promise<IUser> {
  if (Object.values(body).every((item) => item !== null && item !== '')) {
    const { email, name, password, pin, phone } = body
    const user = await this.findOne({ email })
    if (!user) {
      const salt = genSaltSync(10)
      const hash = hashSync(password, salt)
      const member = await this.create({ name, email, phone, password: hash, pin })
      return member
    } else throw Error("User already exists")
  } else throw Error("Fill in all fields")
}

export default model<IUser, IUserModel>('user', userSchema)