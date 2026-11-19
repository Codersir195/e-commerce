import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function AdminSales() {
  const [states, setStates] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: []
  })

  const fetchStates = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        setStates(res.data)
      }

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(()=> {
    fetchStates()
  },[])

  return (
    <div className='pl-87.5 bg-gray-100 py-20 pr-20 mx-auto px-4'>
      <div className='p-6 grid gap-6 lg:grid-cols-4'>
        {/* states Card  */}
        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{states.totalUsers}</CardContent>
        </Card>

        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{states.totalProducts}</CardContent>
        </Card>

        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{states.totalOrders}</CardContent>
        </Card>

        <Card className='bg-pink-500 text-white shadow'>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{states.totalSales}</CardContent>
        </Card>

        {/* sales chart */}
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent style={{height:300}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={states.sales}>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Area type="monotone" dataKey="amount" stroke='#F472B6' fill='#F472B6'/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
