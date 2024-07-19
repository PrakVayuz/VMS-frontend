import React from 'react'
import Header from '../Vendor/Header'
import Stats from '../Vendor/Stats'
import JobList from '../Vendor/JobList'


const VendorDashboard = () => {
  return (
    <div>
      <Header/>
      <Stats/>
      <JobList/>
    </div>
  )
}

export default VendorDashboard;