import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MerchantDashboard from "../../components/merchant/MerchantDashboard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MerchantDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => setLoading(false), []);

  if (loading) return <LoadingSpinner />;
  
const MerchantDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => setLoading(false), []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Merchant Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/merchant/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Manage Products
          </button>

          <button
            onClick={() => navigate("/merchant/inventory")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Manage Inventory
          </button>

          <button
            onClick={() => navigate("/merchant/add-product")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Add New Product
          </button>
        </div>
      </div>

      <MerchantDashboard />
    </div>
  );
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Merchant Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/merchant/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Manage Products
          </button>

          <button
            onClick={() => navigate("/merchant/inventory")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Manage Inventory
          </button>

          <button
            onClick={() => navigate("/merchant/add-product")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700" >
            Add New Product
          </button>
        </div>
      </div>

      <MerchantDashboard />
    </div>
  );
};

export default MerchantDashboardPage;   
