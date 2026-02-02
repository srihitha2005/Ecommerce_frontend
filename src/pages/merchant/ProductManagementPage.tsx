/**
 * ============================================================================
 * PRODUCT MANAGEMENT PAGE - Merchant Product Listing & Management
 * ============================================================================
 * 
 * PURPOSE:
 * - Merchant view of their own products
 * - Add, edit, delete products
 * - View product status (in stock, out of stock)
 * - Manage inventory from this page
 * 
 * KEY FEATURES:
 * 1. MERCHANT LISTINGS:
 *    - Fetch via inventoryService.getMyListings()
 *    - Only shows current merchant's products
 *    - Includes nested product details (name, category, brand)
 *    - Shows inventory status (in stock/out of stock)
 * 
 * 2. QUICK ACTIONS:
 *    - "Edit": Navigate to product edit page
 *    - "Delete": Remove product (with confirmation)
 *    - "Back to Dashboard": Return to main dashboard
 *    - "Manage Inventory": Go to inventory management
 *    - "+ Add New Product": Create new product
 * 
 * 3. EMPTY STATE:
 *    - If no products, show "No products yet" message
 *    - Quick link to add first product
 * 
 * MERCHANT PRODUCT STRUCTURE:
 * {
 *   merchantProductId: string,
 *   product: {
 *     productId: string,
 *     name: string,
 *     category: string,
 *     brand: string,
 *     ...
 *   },
 *   quantity: number,
 *   price: number
 * }
 * 
 * FLOW ON MOUNT:
 * 1. Call inventoryService.getMyListings()
 * 2. Returns MerchantProduct[] with nested product data
 * 3. Display products in table format
 * 4. On edit/delete, call appropriate service
 * 
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../api/inventory.api';
import { InventoryItem } from '../../types/inventory.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Use merchant-specific listings
      const response = await inventoryService.getMyListings();
      if (response.success) {
        // Normalize response.data to an array (API may return single item or array)
        const data = response.data;
        const items = Array.isArray(data) ? data : [data];
        setProducts(items);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching merchant products:', error);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 mt-1">Manage your catalog listing</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/merchant/dashboard')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/merchant/add-product')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-xl mb-4">You haven't listed any products yet.</p>
          <button
            onClick={() => navigate('/merchant/add-product')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Merchant ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</th>
                {/* Edit removed per request - no actions column */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((item) => (
                <tr key={`${item.merchantId}-${item.productId}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.merchantId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.productId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">${(item.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">${((item.totalValue !== undefined) ? item.totalValue : (item.quantity * (item.price || 0))).toFixed(2)}</td>
                  {/* no actions - edit removed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;