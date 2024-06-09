import mongoose from "mongoose";
const Book = mongoose.model("Book", {
  name: String,
  author: String,
  year: Number,
  category: String,
  total: Number,
});

export { Book };
