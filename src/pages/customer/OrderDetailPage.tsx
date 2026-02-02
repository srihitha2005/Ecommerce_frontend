import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "../../api/order.api";
import { productService } from "../../api/product.api";
import { Order } from "../../types/order.types";
import OrderTimeline from "../../components/order/OrderTimeline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading order details...",
  );
  const [usingFallback, setUsingFallback] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const retryFetchDetails = async () => {
    setRetrying(true);
    await fetchOrderDetails(true);
    setRetrying(false);
  };

  // Fetch missing product names from API
  const enrichOrderWithProductNames = async (orderData: Order) => {
    if (!orderData.items) return orderData;

    const enrichedItems = await Promise.all(
      orderData.items.map(async (item) => {
        // If product name is "Product" or empty, try to fetch from API
        if (!item.productName || item.productName === "Product") {
          try {
            // Try to fetch product details using the productId
            const productResponse = await productService.getProductById(
              item.productId || item.merchantProductId || "",
            );
            if (productResponse.success) {
              item.productName = productResponse.data.name;
              console.log(`✅ Fetched product name: ${item.productName}`);
            }
          } catch (error) {
            console.log(
              `⚠️ Could not fetch product name for ${item.productId}`,
            );
          }
        }
        return item;
      }),
    );

    return { ...orderData, items: enrichedItems };
  };

  const fetchOrderDetails = async (isRetry = false) => {
    if (!orderId) return;

    try {
      if (!isRetry) {
        setLoading(true);
        setLoadingMessage("Loading order details...");
      } else {
        setLoadingMessage("Refreshing order status...");
      }

      console.log("Fetching order details for orderId:", orderId);

      // 1. Retrieve Local Storage Data
      const storedOrders = JSON.parse(
        localStorage.getItem("userOrders") || "[]",
      );
      const localOrder = storedOrders.find(
        (o: any) => String(o.orderId) === String(orderId),
      );

      // 2. Fetch Fresh Data from API
      const numericOrderId = parseInt(orderId);

      if (!isRetry) {
        setTimeout(() => {
          setLoadingMessage(
            "Server is starting up (free tier) - checking status...",
          );
        }, 2500);
      }

      const response = await orderService.getOrderDetails(
        String(numericOrderId),
      );
      console.log("📡 Response from getOrderDetails:", response);

      const apiData = response.data || response; // Handle both response.data and direct response

      if (apiData.success) {
        const apiOrder = apiData.data;
        console.log("✅ Order data received:", apiOrder);

        // 3. MERGE STRATEGY
        if (
          (!apiOrder.items || apiOrder.items.length === 0) &&
          localOrder?.items
        ) {
          console.log(
            "⚠️ API returned 0 items. Hydrating with Local Storage items.",
          );
          apiOrder.items = localOrder.items;
          apiOrder.shippingAddress =
            apiOrder.shippingAddress || localOrder.shippingAddress;
          apiOrder.paymentMethod =
            apiOrder.paymentMethod || localOrder.paymentMethod;
          setUsingFallback(true);
        } else {
          setUsingFallback(false);
        }

        setOrder(apiOrder);

        if (isRetry) {
          toast.success("Order status updated!");
        }
      } else {
        throw new Error(apiData.message || "Failed to fetch order");
      }
    } catch (error) {
      console.error("❌ Error fetching order details:", error);

      // 4. Full Fallback
      const storedOrders = JSON.parse(
        localStorage.getItem("userOrders") || "[]",
      );
      const localOrder = storedOrders.find(
        (o: any) => String(o.orderId) === String(orderId),
      );

      if (localOrder) {
        console.log("✅ Using full local backup for order");
        // Enrich with product names before setting
        const enrichedOrder = await enrichOrderWithProductNames(localOrder);
        setOrder(enrichedOrder);
        setUsingFallback(true);
        if (!isRetry)
          toast.warning("Showing cached order details. Server might be busy.");
      } else {
        toast.error("Failed to load order details");
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 text-center max-w-md">
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 text-xl">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-lg p-8 shadow">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order #{order.orderId}</h1>
            <p className="text-gray-600">
              Order Date: {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          {usingFallback && (
            <div className="text-right">
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                Cached View
              </span>
            </div>
          )}
        </div>

        <OrderTimeline order={order} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Items</h2>
            {usingFallback && (
              <button
                onClick={retryFetchDetails}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                disabled={retrying}
              >
                {retrying ? "Refreshing..." : "Refresh Status"}
              </button>
            )}
          </div>

          {usingFallback && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Notice:</strong> Retrieving item details from your local
                receipt. Order status is fetched from the server.
              </p>
            </div>
          )}

          <div className="bg-white border rounded-lg overflow-hidden">
            {order.items && order.items.length > 0 ? (
              <div>
                <div className="bg-gray-50 px-6 py-3 border-b grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 border-b last:border-b-0 grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-6">
                      <p className="font-semibold text-gray-800">
                        {item.productName}
                      </p>
                    </div>
                    <div className="col-span-2 text-center text-gray-600">
                      ${Number(item.price).toFixed(2)}
                    </div>
                    <div className="col-span-2 text-center text-gray-600">
                      x{item.quantity}
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-800">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No items found for this order.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">
                ${Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
              <span>Total Paid</span>
              <span className="text-blue-600">
                ${Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {order.shippingAddress && (
          <div className="mt-8 border-t pt-6">
            <h3 className="font-bold mb-2">Shipping Details</h3>
            <div className="bg-gray-50 p-4 rounded inline-block min-w-[300px]">
              <p className="text-gray-700 whitespace-pre-wrap">
                {order.shippingAddress}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Payment: {order.paymentMethod || "Card"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
