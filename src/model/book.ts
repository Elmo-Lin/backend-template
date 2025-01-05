import mongoose, { Schema, Model } from 'mongoose';
import { Book } from '../type/book';

const bookSchema: Schema<Book> = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BookModel: Model<Book> = mongoose.models.Book || mongoose.model<Book>('Book', bookSchema);
