import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import Navbar from './navbar'

const Layout = () => {
    return (
        <div className='relative'>
            <Navbar />
            <Sidebar />
            <div className='mx-80'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout