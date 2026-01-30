import React, { useState } from 'react';
import { ProductFilters as FiltersType } from '../../types/product.types';

interface ProductFiltersProps {
  onFilter?: (filters: any) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 100000,
  });

  const handleChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 100000,
    };
    setFilters(defaultFilters);
    onFilter?.(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-20">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2">Search</label>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Brands</option>
            <option value="brand1">Brand 1</option>
            <option value="brand2">Brand 2</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', parseFloat(e.target.value))}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <input
              type="number"
              max="100000"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', parseFloat(e.target.value))}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
