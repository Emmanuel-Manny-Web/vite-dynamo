import { Router } from "express"
import API from "../controller/controller"
import { AuthCheck } from "../middleware/auth"

const router = Router()

router.get('/', API.getHome)
router.get('/login', API.getLogin)
router.get('/register', API.getRegister)
router.get('/dashboard', AuthCheck, API.getUserDashboard)
router.get('/transactions', AuthCheck, API.getUserTransaction)
router.get('/buy-airtime', AuthCheck, API.getUserAirtime)
router.get('/data-bundle', AuthCheck, API.getDataBundle)
router.get('/cable-tv', AuthCheck, API.getCableTV)
router.get('/meter-token', AuthCheck, API.getMeterToken)
router.get('/404', AuthCheck, API.get404Page)
router.get('/logout', AuthCheck, API.logout)
router.post('/signup', API.registerUser)
router.post('/signin', API.loginUser)


export default router