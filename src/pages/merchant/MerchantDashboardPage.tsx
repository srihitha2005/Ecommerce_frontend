import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MerchantDashboard from "../../components/merchant/MerchantDashboard";
import { orderService } from "../../api/order.api";
import { Order } from "../../types/order.types";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";

const MerchantDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMerchantOrders();
      const apiResponse = response.data; // Extract the ApiResponse from axios response
      if (apiResponse.success) {
        setOrders(apiResponse.data);
      } else {
        toast.error(apiResponse.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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

      <MerchantDashboard orders={orders} onOrdersRefresh={fetchOrders} />
    </div>
  );
};

export default MerchantDashboardPage;
