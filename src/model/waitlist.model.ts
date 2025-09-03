import mongoose, { Schema, Document,Model } from "mongoose";

interface User extends Document {
   email: string;
   createdAt: Date;
}
const UserScheme: Schema<User> = new Schema<User>({
   email: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
   }, 
});
const WaitlistModel: Model<User> = mongoose.model<User>("Wailst", UserScheme);
export default WaitlistModel;
