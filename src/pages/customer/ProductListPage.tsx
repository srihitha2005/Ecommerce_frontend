import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../api/product.api";
import { inventoryService } from "../../api/inventory.api";
import { Product } from "../../types/product.types";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import ProductCard from "../../components/product/ProductCard";

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productAvailability, setProductAvailability] = useState<
    Record<string, { isAvailable: boolean; totalStock: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    minPrice: 0,
    maxPrice: 100000,
    search: "",
  });
  const navigate = useNavigate();
  const { isAuthenticated, isMerchant } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    // If merchant is logged in, redirect to merchant dashboard instead of public products page
    if (isAuthenticated && isMerchant) {
      navigate("/merchant/dashboard");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        if (response.success) {
          setProducts(response.data);

          // Check availability for each product
          await checkProductAvailability(response.data);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, isMerchant, navigate]);

  const checkProductAvailability = async (productList: Product[]) => {
    const availabilityMap: Record<
      string,
      { isAvailable: boolean; totalStock: number }
    > = {};

    // Check availability for each product concurrently
    const availabilityPromises = productList.map(async (product) => {
      try {
        const inventoryResponse = await inventoryService.getInventoryByProduct(
          product.productId,
        );
        if (
          inventoryResponse.success &&
          Array.isArray(inventoryResponse.data)
        ) {
          const totalStock = inventoryResponse.data.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0,
          );
          availabilityMap[product.id] = {
            isAvailable: totalStock > 0,
            totalStock: totalStock,
          };
        } else {
          availabilityMap[product.id] = {
            isAvailable: false,
            totalStock: 0,
          };
        }
      } catch (error) {
        console.log(`No inventory found for product ${product.productId}`);
        availabilityMap[product.id] = {
          isAvailable: false,
          totalStock: 0,
        };
      }
    });

    await Promise.all(availabilityPromises);
    setProductAvailability(availabilityMap);
  };

  const handleAddToCart = async (merchantProductId: string) => {
    try {
      await addToCart(merchantProductId, 1); // Default quantity 1
    } catch (error) {
      // Error is handled in CartContext
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesCategory =
      !filters.category || product.category === filters.category;
    const matchesBrand = !filters.brand || product.brand === filters.brand;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 className="font-bold text-lg mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) =>
                  setFilters({ ...filters, brand: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() =>
                setFilters({
                  category: "",
                  brand: "",
                  minPrice: 0,
                  maxPrice: 100000,
                  search: "",
                })
              }
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-xl">No products found</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                {filteredProducts.length} products found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const availability = productAvailability[product.id] || {
                    isAvailable: false,
                    totalStock: 0,
                  };
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/products/${product.id}`)}
                      onAddToCart={
                        isAuthenticated ? handleAddToCart : undefined
                      }
                      loading={cartLoading}
                      isAvailable={availability.isAvailable}
                      totalStock={availability.totalStock}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
