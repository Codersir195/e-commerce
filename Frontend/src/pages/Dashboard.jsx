import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className='flex'>
      <Sidebar/>
      <div className='flex-1'>
        <Outlet/>
      </div>
    </div>
  )
}
