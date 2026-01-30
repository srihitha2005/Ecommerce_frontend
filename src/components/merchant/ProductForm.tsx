import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product, ProductFormData } from '../../types/product.types';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
  initialData?: Product;
  isEditMode?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
  isEditMode = false,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      category: initialData.category,
      brand: initialData.brand,
      imageUrls: initialData.imageUrls,
    } : undefined,
  });

  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.imageUrls || []);

  const handleAddImage = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    data.imageUrls = imageUrls.filter(url => url.trim());
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-lg shadow p-8 space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <input
          type="text"
          {...register('name', { required: 'Product name is required' })}
          placeholder="Enter product name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <input
          type="text"
          {...register('category', { required: 'Category is required' })}
          placeholder="e.g., Electronics"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium mb-2">Brand</label>
        <input
          type="text"
          {...register('brand', { required: 'Brand is required' })}
          placeholder="e.g., Samsung"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          placeholder="Enter detailed product description"
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddImage}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Add Image
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
      </button>
    </form>
  );
};

export default ProductForm;
