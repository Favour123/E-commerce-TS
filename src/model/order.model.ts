import { Schema, model, Document,Types } from 'mongoose';
import {CardID} from "../types/user"
interface IOrder extends CardID,Document<Types.ObjectId> {}

const categorySchema = new Schema<IOrder>(
 {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email:{
      type:string
    }
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'card',
      required: true,
      enum: ["card"],
    },
    shippingAddress: {
      type: String,
      required: true,
    },
});

const Order = model<IOrder>('Order', categorySchema);
export default Order;