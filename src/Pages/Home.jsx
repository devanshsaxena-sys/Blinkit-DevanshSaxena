import React from 'react'
import Hero from '../Components/Hero'
import ProductCard from '../Components/ProductCard'
import TopProducts from '../Components/TopProducts'
import PopularCards from '../Components/PopularCards'
export default function Home(){
    return(
        <div>
            <Hero/>
            <ProductCard/>
            <TopProducts/>
            <PopularCards/>
        </div>
    )
}