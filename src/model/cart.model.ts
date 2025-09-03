import mongoose,{ Schema, Document, Types, Model } from 'mongoose';
import  {ICart} from  "../types/user";
export interface CartDocument extends ICart, Document<Types.ObjectId> {}

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Cart:Model<CartDocument> = mongoose.model<CartDocument>('Cart', cartSchema);

export default Cart;