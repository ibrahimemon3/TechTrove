import React from "react";

const Table = ({ products, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-gray-800 border border-gray-600 rounded-lg overflow-hidden shadow-lg mt-8 text-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b border-gray-600">Product Image</th>
          <th className="py-2 px-4 border-b border-gray-600">Category</th>
          <th className="py-2 px-4 border-b border-gray-600">Product Name</th>
          <th className="py-2 px-4 border-b border-gray-600">Price</th>
          <th className="py-2 px-4 border-b border-gray-600">Brand</th>
          <th className="py-2 px-4 border-b border-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product._id}>
            <td className="py-2 px-4 border-b border-gray-600">
              {product.image ? (
                <img src={product.image} alt={product.productName} className="h-16 w-16 object-cover rounded-md" />
              ) : (
                "No Image"
              )}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">{product.category}</td>
            <td className="py-2 px-4 border-b border-gray-600">{product.productName}</td>
            <td className="py-2 px-4 border-b border-gray-600">${product.price}</td>
            <td className="py-2 px-4 border-b border-gray-600">{product.brand}</td>
            <td className="py-2 px-4 border-b border-gray-600">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
