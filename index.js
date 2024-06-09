import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { Book } from "./models/Book.js";

mongoose
  .connect("****")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const typeDefs = `#graphql
  type Book {
    id: ID
    name: String,
    author: String,
    year: Int,
    category: String,
    total: Int
  }

  type Mutation {
    addBook(name: String!, author: String!, year: Int!, category: String!, total: Int!): Book,
    deleteBook(id: ID!): Book,
    updateBook(id: ID!, name: String, author: String, year: Int, category: String, total: Int): Book
  }

  type Query {
    books: [Book],
    book(id: ID): Book
  }
`;

const resolvers = {
  Query: {
    books: async () => await Book.find({}),
    book: async (parent, args) => await Book.findById(args.id),
  },
  Mutation: {
    addBook: (_, { name, author, year, category, total }) => {
      const book = new Book({
        name,
        author,
        year,
        category,
        total,
      });
      return book.save();
    },
    deleteBook: async (_, { id }) => {
      const deletedBook = await Book.findByIdAndDelete(id);
      return deletedBook;
    },
    updateBook: async (_, { id, name, author, year, category, total }) => {
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        { name, author, year, category, total },
        { new: true }
      );
      return updatedBook;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
