import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type AddInventoryForm = {
  productId: string;
  quantity: number;
  price: number;
};

interface ProductFormProps {
  onSubmit: (data: AddInventoryForm) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<AddInventoryForm>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, loading = false, initialData }) => {
  const { register, handleSubmit } = useForm<AddInventoryForm>({
    defaultValues: initialData as AddInventoryForm | undefined,
  });

  const handleFormSubmit = async (data: AddInventoryForm) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-lg shadow p-8 space-y-6">
      {/* Product Identifier */}
      <div>
        <label className="block text-sm font-medium mb-2">Product ID</label>
        <input
          type="text"
          {...register('productId', { required: true })}
          placeholder="e.g., A5031r5"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <input
          type="number"
          {...register('quantity', { valueAsNumber: true, required: true })}
          placeholder="e.g., 100"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">Price</label>
        <input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true, required: true })}
          placeholder="e.g., 1500.00"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
