import React from 'react'
import { Route, Routes } from "react-router-dom";
import Header from './Components/Header'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
export default function App(){
  return(
    <>
      <Header/>
      <Routes>
        <Route path="/"element={<Home/>}/>
        <Route path="/product/:id"element={<ProductDetails/>}/>
      </Routes>
      </>
  )
}