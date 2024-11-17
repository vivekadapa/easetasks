
import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import Navbar from './navbar'

const Layout = () => {
    return (
        <div>
            <Navbar />
            <div className='relative min-w-full overflow-y-hidden flex items-center'>
                <Sidebar />
            </div>
            <Outlet />
        </div>
    )
}

export default Layout