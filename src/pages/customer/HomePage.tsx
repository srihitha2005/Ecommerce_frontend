import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
// import ProductFilters from '../../components/product/ProductFilters'; // Filter UI Import
import { productService } from '../../api/product.api';
import { Product } from '../../types/product.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const HomePage: React.FC = () => {
  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Filter State
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      console.log('API Response Data:', response.data);
      if (response.data && response.data.length > 0) {
        console.log('First product structure:', response.data[0]);
      }

      if (response.success) {
        setProducts(response.data);
        // setFilteredProducts(response.data); // Filter Logic
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  /* // FILTER LOGIC COMMENTED OUT
  const handleFilter = (filters: any) => {
    console.log("Current Filters applied:", filters);
    let filtered = [...products];

    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category && filters.category !== "" && filters.category !== "All") {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.brand && filters.brand !== "") {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }

    if (filters.minPrice !== undefined && filters.minPrice !== "") {
      filtered = filtered.filter(p => p.price !== undefined && p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
      filtered = filtered.filter(p => p.price !== undefined && p.price <= Number(filters.maxPrice));
    }

    setFilteredProducts(filtered);
  };
  */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Ecommerce Store</h1>
          <p className="text-xl">Find amazing products from trusted merchants</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Removed flex gap-8 to allow grid to be full width */}
        <div className="">
          {/* Sidebar UI Commented Out
          <div className="w-64 flex-shrink-0">
            <ProductFilters onFilter={handleFilter} />
          </div>
          */}

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? ( // Changed from filteredProducts to products
              <div className="text-center py-12">
                <p className="text-gray-600 text-xl">No products found</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">{products.length} products found</p>
                <ProductGrid 
                  products={products} // Passing original products array
                  onProductClick={(product) => navigate(`/products/${product.id}`)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;