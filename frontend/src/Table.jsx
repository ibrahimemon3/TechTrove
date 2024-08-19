import React from "react";

const Table = ({ products, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg mt-8">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Product Image</th>
          <th className="py-2 px-4 border-b">Category</th>
          <th className="py-2 px-4 border-b">Product Name</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Brand</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product._id}>
            <td className="py-2 px-4 border-b">
              {product.image ? (
                <img src={product.image} alt={product.productName} className="h-16 w-16 object-cover rounded-md" />
              ) : (
                "No Image"
              )}
            </td>
            <td className="py-2 px-4 border-b">{product.category}</td>
            <td className="py-2 px-4 border-b">{product.productName}</td>
            <td className="py-2 px-4 border-b">${product.price}</td>
            <td className="py-2 px-4 border-b">{product.brand}</td>
            <td className="py-2 px-4 border-b">
              <button
                onClick={() => onEdit(index)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(index)}
                className="text-red-500 hover:text-red-700"
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
