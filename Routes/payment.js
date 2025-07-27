import express from 'express'
import { checkout, Verify } from '../Controllers/payment.js';


const router = express.Router();

//initiate payment OR checkout
//@api - api/payment/checkout
router.post('/checkout', checkout)
 
//verify Payment and save to DB
//@api - api/payment/verify-payment
router.post('/verify-payment', Verify)

export default router