import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import Navbar from './navbar'

const Layout = () => {
    return (
        <div className='overflow-hidden'>
            <Navbar />
            <div className='relative min-w-full overflow-y-hidden flex items-center'>
                <Sidebar />
                <div className='overflow-x-auto overflow-y-hidden'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout