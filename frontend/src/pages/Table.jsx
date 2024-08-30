import React, { useEffect, useState } from "react";

const Table = ({ products, onEdit, onDelete }) => {
  const storedAdmin = localStorage.getItem("loggedinUserAdmin");
  console.log("storedAdmin", storedAdmin);
  const [admin, setAdmin] = useState(false);
  useEffect(()=>{
    if(storedAdmin === "true")
      {
        setAdmin(true)
      }
  },[])
  console.log("admin", admin);
  return (
    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg mt-8">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b border-gray-700 text-gray-200">
            Product Image
          </th>
          <th className="py-2 px-4 border-b border-gray-700 text-gray-200">
            Category
          </th>
          <th className="py-2 px-4 border-b border-gray-700 text-gray-200">
            Product Name
          </th>
          <th className="py-2 px-4 border-b border-gray-700 text-gray-200">
            Price
          </th>
          <th className="py-2 px-4 border-b border-gray-700 text-gray-200">
            Brand
          </th>
          <th className="py-2 px-4 border-b border-gray-700 text-gray-200">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product._id}>
            <td className="py-2 px-4 border-b border-gray-700">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.productName}
                  className="h-16 w-16 object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </td>
            <td className="py-2 px-4 border-b border-gray-700 text-gray-200">
              {product.category}
            </td>
            <td className="py-2 px-4 border-b border-gray-700 text-gray-200">
              {product.productName}
            </td>
            <td className="py-2 px-4 border-b border-gray-700 text-gray-200">
              ${product.price}
            </td>
            <td className="py-2 px-4 border-b border-gray-700 text-gray-200">
              {product.brand}
            </td>
            <td className="py-2 px-4 border-b border-gray-700">
              {
                admin ? (
                  <div>
                    <button
                      onClick={() => onEdit(index)}
                      className="text-blue-400 hover:text-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div></div>
                )
                // <div>
                //   <button
                //   onClick={() => onEdit(index)}
                //   className="text-blue-400 hover:text-blue-600 mr-2"
                // >
                //   Edit
                // </button>
                // <button
                //   onClick={() => onDelete(index)}
                //   className="text-red-400 hover:text-red-600"
                // >
                //   Delete
                // </button>
                // </div>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
