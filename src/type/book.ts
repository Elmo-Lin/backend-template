export interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
  }
  
export interface CreateBookRequest {
    Body: {
        title: string;
        author: string;
        year: number;
    };
}
  
export interface GetBookByIdRequest {
    Params: {
        id: string;
    };
}
  
export interface UpdateBookRequest {
    Params: {
        id: string;
    };
    Body: {
        title: string;
        author: string;
        year: number;
    };
}
  
export interface DeleteBookRequest {
    Params: {
        id: string;
    };
}