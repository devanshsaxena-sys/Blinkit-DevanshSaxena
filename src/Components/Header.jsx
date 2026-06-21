import React from 'react'
import BlinkitLogo from '../assets/Blinkit.jpg';
export default function Header(){
    return(
        <div>
            <ul className='flex justify-center gap-4 p-4'>
                <li>
                    <img
                      src={BlinkitLogo}
                      alt="Blinkit Logo"
                      className="h-8"
/>
                </li>
                <li>
                    My Location
                </li>
                <li>
                    <input value="Search" 
                    className='border border-gray-300
                    rounded-md px-2 py-1 focus:outline-none
                    focus:ring-2 focus:ring-blue-500'/>
                </li>
                <li>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500'>Login</button>

                </li>
                <li>
                    <button className='bg-green-500 text-white px-4 py-2
                    rounded-md hover:bg-green-600
                    focus:outline-none focus:ring-2 focus:ring-green-500'>My Cart</button>
                </li>
            </ul>
        </div>
    );
}