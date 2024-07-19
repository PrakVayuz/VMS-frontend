import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Typography, Input, Button } from '@material-tailwind/react';

const CreateJobDescriptionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/api/admin/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert('Job description created successfully!');
        setFormData({ title: '', description: '' }); 
      } else {
        alert(`Failed to create job description: ${result.msg}`);
      }
    } catch (error) {
      console.error('Error creating job description:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Card className="mt-8 mx-auto max-w-lg">
      <CardHeader floated={false} shadow={false} color="transparent" className="mb-4 p-6">
        <Typography variant="h5" color="blue-gray">
          Create Job Description
        </Typography>
      </CardHeader>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="title"
            label="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
         <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows="5" // Adjust the number of rows as needed
      />
          <Button type="submit" color="blue">
            Create Job
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateJobDescriptionForm;
