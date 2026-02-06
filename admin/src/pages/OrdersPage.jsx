import { orderApi } from "../lib/api.js";
import { formatDate } from "../lib/utils.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
    onError: (error) => {
      toast.error("Failed to update order status. Please try again.");

      Sentry.captureException(error, {
        tags: { component: "OrdersPage" },
        extra: { context: "update_order_status" },
      });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const orders = ordersData || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-base-content/70">Manage all customer orders here.</p>
      </div>

      {/* ORDERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">
                Failed to load orders
              </p>
              <p className="text-sm">{error?.message ?? "Please try again."}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No orders yet.</p>
              <p className="text-sm">
                Orders will appear here once they are placed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    );

                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="font-medium">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="font-medium">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}
                          </div>
                        </td>

                        <td>
                          <div className="font-medium">
                            {totalQuantity} items
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 &&
                              ` +${order.orderItems.length - 1} more`}
                          </div>
                        </td>

                        <td>
                          <span className="font-semibold">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </td>

                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="select select-sm"
                            disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>

                        <td>
                          <span className="text-sm opacity-60">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
