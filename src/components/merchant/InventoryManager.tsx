import React from 'react';

interface InventoryManagerProps {
  inventory: any[];
  onRefresh?: () => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <p className="text-gray-600 text-lg">Inventory management has been removed. Manage stock on the Products page.</p>
    </div>
  );
};

export default InventoryManager;
