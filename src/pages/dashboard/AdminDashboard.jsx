import React, { useState, useEffect } from 'react';
import CreateJobDescriptionForm from './form';

import JobDescriptionTable from './JobDescriptionTable';



const AdminDashboard = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);

  const fetchJobDescriptions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/job-descriptions');
      if (response.ok) {
        const data = await response.json();
        setJobDescriptions(data); 
      } else {
        console.error('Failed to fetch job descriptions');
      }
    } catch (error) {
      console.error('Error fetching job descriptions:', error);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  // Function to handle edit action
  const handleEdit = (id) => {
    // Implement edit logic here
    console.log(`Editing job description with ID: ${id}`);
  };

  // Function to handle delete action
  const handleDelete = (id) => {
    // Implement delete logic here
    console.log(`Deleting job description with ID: ${id}`);
  };

  return (
    <div className="mt-8 mx-auto max-w-4xl">
      <CreateJobDescriptionForm />
      <JobDescriptionTable/>
    </div>
  );
};

export default AdminDashboard;
