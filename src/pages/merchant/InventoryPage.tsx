import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../api/inventory.api';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InventoryManager from '../../components/merchant/InventoryManager';
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
      <InventoryManager inventory={inventory} onRefresh={fetchInventory} />
    </div>
  );
};

export default InventoryPage;
