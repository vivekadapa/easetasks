import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import Navbar from './navbar'

const Layout = () => {
    return (
        <div className='overflow-hidden'>
            <Navbar />
            <div className='relative min-w-full flex items-center'>
                <Sidebar />
                <div className='overflow-x-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout