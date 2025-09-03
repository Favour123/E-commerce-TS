import { Schema, model, Document } from 'mongoose';
import {ProductCategory} from "../types/user"
interface ICategory extends ProductCategory,Document {}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

});

const Category = model<ICategory>('Category', categorySchema);
export default Category;