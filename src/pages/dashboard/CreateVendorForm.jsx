import React, { useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Button,
  Switch,
} from "@material-tailwind/react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateVendorForm = ({ onCreateVendor, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      verified: false,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const password = generatePassword();
        const payload = {
          ...values,
          registrationDate: new Date(),
          password,
        };
        const response = await axios.post('http://localhost:3000/api/admin/create', payload);
        onCreateVendor(response.data);
        toast.success('Vendor created successfully');
        onCancel(); // Close modal on success
      } catch (error) {
        console.error('Error creating vendor:', error);
        toast.error(`Error creating vendor:${error.message}`);
        onCancel();
      } finally {
        setLoading(false);
      }
    },
  });

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let password = "";
    for (let i = 0; i < length; i++) {
      const char = charset[Math.floor(Math.random() * charset.length)];
      password += char;
    }
    return password;
  };

  return (
    <Dialog open={true} onClose={onCancel}>
      <DialogHeader>Create Vendor</DialogHeader>
      <DialogBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              id="username"
              type="text"
              {...formik.getFieldProps('username')}
              className={`mt-1 block w-full ${formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-red-500 text-sm">{formik.errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`mt-1 block w-full ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="verified" className="block text-sm font-medium text-gray-700">
              Verified
            </label>
            <Switch
              id="verified"
              checked={formik.values.verified}
              onChange={formik.handleChange}
              className="mt-1 block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <Button type="submit" color="blue" ripple="light" disabled={loading} className="mr-4">
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button color="gray" ripple="light" onClick={onCancel}>
            Cancel
          </Button>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default CreateVendorForm;
