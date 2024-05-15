import React from 'react'
import HeaderNavigation from './HeaderNavigation'

const Header = () => {
    return (
        <header className="header">
            <div className="flex items-center gap-2.5">
                
                <h3 className="text-black  dark:text-white font-semibold">
                    Welcome {'Jochee'} 
                    {/* Usersname information passed down to the dashboard */}
                </h3>
            </div>
            <HeaderNavigation />
        </header>
    )
}

export default Header