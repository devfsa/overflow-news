import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => (
  <div className="hack container">
    <Header />
    <div className="content">
      {children}
    </div>
    <Footer />
  </div>
)

export default Layout
