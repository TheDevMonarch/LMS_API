import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId:{type:mongoose.Schema.Types.ObjectId,
    ref:'Students',
    required:true
  },
  orederDate:{type:Date, default:Date.now},
  orderId:{type:String, required:true},
  amount:{type:Number, required:true},
  bookIds:[],
  payStatus:{type:String}
},{
  strict:false
})

export const Payment = mongoose.model('Payment', paymentSchema)