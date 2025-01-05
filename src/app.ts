import fastify, { FastifyInstance } from "fastify";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

interface CreateBookRequest {
  Body: {
    title: string;
    author: string;
    year: number;
  };
}

interface GetBookByIdRequest {
  Params: {
    id: string;
  };
}

interface UpdateBookRequest {
  Params: {
    id: string;
  };
  Body: {
    title: string;
    author: string;
    year: number;
  };
}

interface DeleteBookRequest {
  Params: {
    id: string;
  };
}

interface ServerConfig {
  host: string;
  port: number;
}

const createServer = (config: ServerConfig): FastifyInstance => {
  const server = fastify({ logger: true });

  const books: Book[] = [];
  let idCounter = 1;


  server.post<CreateBookRequest>("/books", async (request, reply) => {
    await pipe(
      TE.of({}),
      TE.bind("validInput", () => {
        const { title, author, year } = request.body;
        return title && author && year
          ? TE.right({ title, author, year })
          : TE.left({ error: "Title, author, and year are required!" });
      }),
      TE.map(({ validInput }) => {
        const newBook: Book = {
          id: idCounter++,
          ...validInput,
        };
        books.push(newBook);
        return newBook;
      }),
      TE.match(
        (error) => reply.status(400).send(error),
        (newBook) => reply.status(201).send(newBook)
      )
    )();
  });

  
  server.get("/books", async (_, reply) => {
    reply.send(books);
  });

 
  server.get<GetBookByIdRequest>("/books/:id", async (request, reply) => {
    await pipe(
      TE.of({}),
      TE.bind("book", () => {
        const book = books.find((b) => b.id === parseInt(request.params.id, 10));
        return book ? TE.right(book) : TE.left({ error: "Book not found!" });
      }),
      TE.match(
        (error) => reply.status(404).send(error),
        ({ book }) => reply.status(200).send(book)
      )
    )();
  });

  server.put<UpdateBookRequest>("/books/:id", async (request, reply) => {
    const { id } = request.params;
    const { title, author, year } = request.body;
  
    await pipe(
      TE.of({}),
      TE.bind("bookIndex", () => {
        const bookIndex = books.findIndex((b) => b.id === parseInt(id));
        return bookIndex !== -1
          ? TE.right(bookIndex)
          : TE.left({ error: "Book not found!" });
      }),
      TE.bind("validInput", () =>
        pipe(
          { title, author, year },
          ({ title, author, year }) =>
            title && author && year
              ? TE.right({ title, author, year })
              : TE.left({ error: "Title, author, and year are required!" })
        )
      ),
      TE.bind("updatedBook", ({ bookIndex, validInput }) => {
        const updatedBook = { id: parseInt(id), ...validInput };
        books[bookIndex] = updatedBook;
        return TE.right(updatedBook);
      }),
      TE.match(
        (error) => reply.status(400).send(error),
        ({updatedBook}) => reply.status(200).send(updatedBook)
      )
    )();
  });
  

  server.delete<DeleteBookRequest>("/books/:id", async (request, reply) => {
    await pipe(
      TE.of({}),
      TE.bind("bookIndex", () => {
        const bookIndex = books.findIndex(
          (b) => b.id === parseInt(request.params.id, 10)
        );
        return bookIndex !== -1
          ? TE.right(bookIndex)
          : TE.left({ error: "Book not found!" });
      }),
      TE.map(({ bookIndex }) => {
        books.splice(bookIndex, 1);
      }),
      TE.match(
        (error) => reply.status(404).send(error),
        () => reply.status(204).send()
      )
    )();
  });

  return server;
};

const startServer = async (
  config: ServerConfig = { host: "0.0.0.0", port: 3000 }
) => {
  const server = createServer(config);
  try {
    await server.listen({ host: config.host, port: config.port });
    server.log.info(`Server is running at http://${config.host}:${config.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export { startServer, createServer };
