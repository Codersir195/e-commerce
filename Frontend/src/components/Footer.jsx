import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-200 py-10'>
        <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
            {/* info */}
            <div className='mb-6 md:mb-0'>
                <Link to="/">
                    <img src="card.png" alt="" className='w-32' />
                </Link>
                <p className='mt-2 text-sm'>Powering Your world with the Best in Electronics</p>
                <p className='mt-2 text-sm'>123 Electronics st Style city ny 10001</p>
                <p className='text-sm'>Email: support@myshop.com</p>
                <p className='text-sm'>Phone: (123) 7864-94314</p>
            </div>
            {/* customer service link */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Customer Service</h3>
                <ul className='mt-2 text-sm space-y-2'>
                    <li>Contact Us</li>
                    <li>Shopping & Returns</li>
                    <li>FAQs</li>
                    <li>Order Tracking</li>
                    <li>Size Guide</li>
                </ul>
            </div>
            {/* social media links  */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Follow Us</h3>
                <div className='flex space-x-4 mt-2'>
                    <Facebook/>
                    <Instagram/>
                    <Twitter/>
                    <Youtube/>
                </div>
            </div>
            {/* newsletter subscription */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
                <p className='mt-2 text-sm'> Subscribe to get special offers, free giveaways, and more</p>
                <form action="" className='mt-4 flex'>
                    <input type="text" 
                    placeholder='Your email address' 
                    className='w-full p-2 rounded-l-md bg-white text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'/>
                    <button type='submit' className='bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700'>Subscribe</button>
                </form>
            </div>
        </div>
        {/* Bottom section  */}
        <div className='mt-8 border-t border-gray-700 text-center text-sm'>
            <p>&copy; {new Date().getFullYear()} <span className='text-pink-600'>EKart</span>. All rights reserved</p>
        </div>
    </footer>
  )
}
