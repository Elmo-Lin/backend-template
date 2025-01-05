import { BookModel } from '../model/book';
import { Book } from '../type/book';

/**
 * 取得所有書籍
 * @returns 所有書籍的陣列
 */
export const getAllBooks = async (): Promise<Book[]> => {
  return await BookModel.find();
};

/**
 * 根據 ID 查詢書籍
 * @param id - 書籍的 ID
 * @returns 書籍資料或 null
 */
export const getBookById = async (id: number): Promise<Book | null> => {
  return await BookModel.findOne({ id });
};

/**
 * 創建一本新書
 * @param book - 書籍資料
 * @returns 創建的書籍
 */
export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const lastBook = await BookModel.findOne().sort({ id: -1 }); // 獲取最新的書籍
  const nextId = lastBook ? lastBook.id + 1 : 1;

  const newBook = new BookModel({
    ...book,
    id: nextId,
  });
  return await newBook.save();
};

/**
 * 更新書籍資料
 * @param id - 書籍 ID
 * @param updatedBook - 更新後的書籍資料
 * @returns 更新後的書籍或 null
 */
export const updateBook = async (
  id: number,
  updatedBook: Partial<Omit<Book, 'id'>>
): Promise<Book | null> => {
  return await BookModel.findOneAndUpdate({ id }, updatedBook, { new: true });
};

/**
 * 刪除一本書
 * @param id - 書籍 ID
 * @returns 刪除的書籍或 null
 */
export const deleteBook = async (id: number): Promise<Book | null> => {
  return await BookModel.findOneAndDelete({ id });
};
