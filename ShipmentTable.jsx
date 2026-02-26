function ShipmentTable({ orders }) {
  return (
    <div className="mt-10 bg-gray-900 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Table Header Section */}
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          Recent Orders
        </h3>
        <span className="text-sm text-gray-400">
          Total: {orders?.length || 0}
        </span>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          
          {/* THEAD */}
          <thead className="bg-gray-800 text-gray-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Pickup</th>
              <th className="px-6 py-4">Delivery</th>
              <th className="px-6 py-4">ETA</th>
              <th className="px-6 py-4">Created</th>
            </tr>
          </thead>

          {/* TBODY */}
          <tbody>
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <tr
                  key={order.order_id}
                  className={`border-b border-gray-800 transition hover:bg-gray-800/60 ${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-850"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {order.customer_name}
                  </td>

                  <td className="px-6 py-4">
                    {order.pickup_location}
                  </td>

                  <td className="px-6 py-4">
                    {order.delivery_location}
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
                      {order.predicted_eta_minutes} mins
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-16 text-center">
                  <div className="flex flex-col items-center text-gray-500">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-lg font-medium">
                      No orders yet
                    </p>
                    <p className="text-sm mt-1">
                      Create your first order to get started 🚀
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShipmentTable;