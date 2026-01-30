import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { searchService } from '../../api/search.api';
import { Product } from '../../types/product.types';
import { toast } from 'react-toastify';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    searchProducts();
  }, [query]);

  const searchProducts = async () => {
    if (!query) return;

    try {
      setLoading(true);
      const response = await searchService.search(query);
      if (response.success) {
        setProducts(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">Results for: <strong>{query}</strong></p>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl">No products found for "{query}"</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6">{products.length} products found</p>
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
