import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (res.data.success) {
        setOrders(res.data.orders)
      }
    } catch (error) {
      console.error("❌ Failed to fetch admin Orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [accessToken])

  if (loading) {
    return <div className='text-center py-20 text-gray-500'>Loading All Orders....</div>
  }

  return (
    <div className='pl-87.5 py-20 pr-20 mx-auto px-4'>
      <h1 className='text-3xl font-bold mb-6'>Admin - All Orders</h1>

      {orders.length === 0 ? (
        <p className='text-gray-500'>No Orders Found.</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full border border-gray-200 text-left text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-2 border'>Order ID</th>
                <th className='px-4 py-2 border'>User</th>
                <th className='px-4 py-2 border'>Products</th>
                <th className='px-4 py-2 border'>Amount</th>
                <th className='px-4 py-2 border'>Status</th>
                <th className='px-4 py-2 border'>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className='hover:bg-gray-50'>
                  <td className='px-4 py-2 border'>{order._id}</td>

                  <td className='px-4 py-2 border'>
                    {order.user?.firstName} {order.user?.lastName} <br />
                    <span className='text-xs text-gray-500'>{order.user?.email}</span>
                  </td>

                  <td className='px-4 py-2 border'>
                    {order.products?.map((p, idx) => (
                      <div key={idx} className='text-sm'>
                        {p.productId?.category} x {p.quantity}
                      </div>
                    ))}
                  </td>

                  <td className='px-4 py-2 border font-semibold'>
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>

                  <td className={`px-4 py-1 rounded text-xs font-medium ${order.status === "Paid" ? "bg-green-100 text-green-700" : order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    <span className='text-xs text-gray-500'>
                      {order.status}
                    </span>
                  </td>
                  <td className='px-4 py-2 border'>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
