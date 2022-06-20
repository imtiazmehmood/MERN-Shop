import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Book } from "../../Components";

const Books = () => {
  const history = useHistory();
  const URL = "https://imimernshop.herokuapp.com/books/";
  const [books, setBooks] = useState("");

  const fetchHandler = async () => {
    return axios.get(URL).then((res) => res.data);
  };

  const onDeleteBook = (id) => {
    const URL = `https://imimernshop.herokuapp.com/books/${id}`;
    console.log(URL);
    axios.delete(URL).then((b) => console.log(b.data));
  };

  useEffect(() => {
    fetchHandler()
      .then((b) => setBooks(b.books))
      .catch((err) => console.log("Error >>", err));
  }, []);
  console.log("books >>", books);
  return (
    <div className="flex flex-col items-center justify-center">
      <p>All Books Are Here</p>
      <button
        onClick={() => history.push("/addbook")}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Add Book
      </button>
      <div className="p-5 flex flex-wrap gap-3 items-center">
        {books &&
          books.map((book, i) => (
            <div key={i}>
              <Book book={book} onDelete={() => onDeleteBook(book._id)} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Books;
