import * as BookRepo from '../repo/book';
import { Book } from '../type/book';

/**
 * 創建一本書
 * @param book - 書籍資料
 * @returns 創建的書籍
 */
export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  return await BookRepo.createBook(book);
};

/**
 * 根據 ID 查詢一本書
 * @param id - 書籍 ID
 * @returns 書籍資料或 null
 */
export const getBookById = async (id: number): Promise<Book | null> => {
  return await BookRepo.getBookById(id);
};

/**
 * 獲取所有書籍
 * @returns 所有書籍的陣列
 */
export const getAllBooks = async (): Promise<Book[]> => {
  return await BookRepo.getAllBooks();
};

/**
 * 更新一本書
 * @param id - 書籍 ID
 * @param updatedBook - 更新後的書籍資料
 * @returns 更新後的書籍或 null
 */
export const updateBook = async (
  id: number,
  updatedBook: Partial<Omit<Book, 'id'>>
): Promise<Book | null> => {
  return await BookRepo.updateBook(id, updatedBook);
};

/**
 * 刪除一本書
 * @param id - 書籍 ID
 * @returns 刪除的書籍或 null
 */
export const deleteBook = async (id: number): Promise<Book | null> => {
  return await BookRepo.deleteBook(id);
};
