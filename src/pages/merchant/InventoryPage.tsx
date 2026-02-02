import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../api/inventory.api';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
// InventoryManager removed — inventory is now read-only from merchant product pages
import { toast } from 'react-toastify';

const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInventory();
    }
  }, [user]);

  const fetchInventory = async () => {
    if (!user || !user.userId) return;

    try {
      setLoading(true);
      const response = await inventoryService.getMerchantInventory(user.userId);
      if (response.success) {
        setInventory(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500 mt-1">Update stock levels and pricing</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Product ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{item.productId || item.id}</td>
                  <td className="px-6 py-3">{item.quantity}</td>
                  <td className="px-6 py-3">${(item.price || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;