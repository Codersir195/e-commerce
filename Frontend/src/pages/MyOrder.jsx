import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function MyOrder() {
    const [userOrder, setUserOrder] = useState(null)

    const getUserOrder = async () => {
        const accessToken = localStorage.getItem("accessToken")
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/my-order`, {
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
        <>
        <OrderCard userOrder={userOrder}/>
        </>
    )
}

export default MyOrder
