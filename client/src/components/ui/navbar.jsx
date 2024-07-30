import React from 'react'

const navbar = () => {
    return (
        <div className='p-4 flex items-center gap-2'>
            <img src="./logo.svg" alt="" />
            <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-3xl'>EaseTasks</h1>
        </div>
    )
}

export default navbar