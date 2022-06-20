import React from "react";
import { useHistory } from "react-router-dom";
const Book = (props) => {
  const history = useHistory();
  const { _id, name, author, description, price, image } = props.book;
  const img = new Buffer.from(image?.data).toString("base64");
  return (
    <div className=" bg-gray-50 mb-5 rounded-lg p-3 w-80 h-1/4 group cursor-pointer transition duration-100 ease-in transform sm:hover:scale-105 hover:z-50">
      <img
        src={img}
        alt={name}
        className="object-cover object-center rounded-lg"
      />
      <div className=" text-blue-900 font-sans font-medium">
        <article>By {author}</article>
        <h3>{name}</h3>
        <p>{description}</p>
        <h2>{price}</h2>
      </div>
      <div className="flex w-full justify-between">
        <button
          onClick={() => history.push("/updatebook", { _id })}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Update
        </button>
        <button
          onClick={props.onDelete}
          className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Book;
