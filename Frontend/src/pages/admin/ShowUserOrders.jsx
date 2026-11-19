import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function ShowUserOrders() {
  const params = useParams()
  const [userOrder, setUserOrder] = useState(null)

  const getUserOrder = async () => {
    const accessToken = localStorage.getItem("accessToken")    

    const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/user-order/${params.userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (res.data.success) {
      setUserOrder(res.data.orders)
    }
  }

  useEffect(() => {
    getUserOrder()
  }, [])
  return (
    <div className='pl-87.5 py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100'>
      <OrderCard userOrder={userOrder} />
    </div>
  )
}
