import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCartPlus } from "@fortawesome/free-solid-svg-icons";

const Table = ({ products, onEdit, onDelete, onAddToCart }) => {
  const storedAdmin = localStorage.getItem("loggedinUserAdmin");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (storedAdmin === "true") {
      setAdmin(true);
    }
  }, [storedAdmin]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg mt-8 w-full">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b border-gray-700 text-gray-200 text-left">Product Image</th>
            <th className="py-3 px-4 border-b border-gray-700 text-gray-200 text-left">Category</th>
            <th className="py-3 px-4 border-b border-gray-700 text-gray-200 text-left">Product Name</th>
            <th className="py-3 px-4 border-b border-gray-700 text-gray-200 text-left">Price</th>
            <th className="py-3 px-4 border-b border-gray-700 text-gray-200 text-left">Brand</th>
            <th className="py-3 px-4 border-b border-gray-700 text-gray-200 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td className="py-3 px-4 border-b border-gray-700">
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
              <td className="py-3 px-4 border-b border-gray-700 text-gray-200">
                {product.category}
              </td>
              <td className="py-3 px-4 border-b border-gray-700 text-gray-200">
                {product.productName}
              </td>
              <td className="py-3 px-4 border-b border-gray-700 text-gray-200">
                ৳{product.price}
              </td>
              <td className="py-3 px-4 border-b border-gray-700 text-gray-200">
                {product.brand}
              </td>
              <td className="py-3 px-4 border-b border-gray-700 text-gray-200">
                <div className="flex justify-center gap-2">
                  {!admin && (
                    <button
                      onClick={() => onAddToCart(index)}
                      className="flex items-center justify-center w-16 h-8 bg-green-500 hover:bg-green-600 rounded-md text-white shadow-md transition-transform transform hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                  )}
                  {admin && (
                    <>
                      <button
                        onClick={() => onEdit(index)}
                        className="flex items-center justify-center w-16 h-8 bg-blue-500 hover:bg-blue-600 rounded-md text-white shadow-md transition-transform transform hover:scale-105"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => onDelete(index)}
                        className="flex items-center justify-center w-16 h-8 bg-red-500 hover:bg-red-600 rounded-md text-white shadow-md transition-transform transform hover:scale-105"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
