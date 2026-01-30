import React, { useState } from 'react';
import { inventoryService } from '../../api/inventory.api';
import { toast } from 'react-toastify';

interface InventoryItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
}

interface InventoryManagerProps {
  inventory: any[];
  onRefresh?: () => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, onRefresh }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
  };

  const handleSave = async (itemId: number) => {
    try {
      await inventoryService.updateInventory(itemId, {
        merchantId: 0,
        productId: '',
        quantity: parseInt(quantity),
        price: parseFloat(price),
      });
      toast.success('Inventory updated successfully!');
      setEditingId(null);
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to update inventory');
    }
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryService.deleteInventory(itemId);
        toast.success('Item deleted successfully!');
        onRefresh?.();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  if (inventory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 text-lg">No inventory items yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Product ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-6 py-3">{item.productId || item.id}</td>
              <td className="px-6 py-3">
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td className="px-6 py-3">
                {editingId === item.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                ) : (
                  `$${item.price?.toFixed(2) || '0.00'}`
                )}
              </td>
              <td className="px-6 py-3 flex gap-2">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() => handleSave(item.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManager;
