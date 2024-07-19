import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Input,
} from '@material-tailwind/react';
import { PencilIcon } from '@heroicons/react/24/solid';
import ProfileInfoCard from './ProfileInfoCard';
import { GiCrossMark } from "react-icons/gi";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ImSpinner6 } from 'react-icons/im';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Profile() {
  const [admin, setAdmin] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch Admin Profile
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(response.data);
        formik.setValues({
          adminId: response.data._id,
          username: response.data.username,
          email: response.data.email,
          mobile: response.data.mobile,
          location: response.data.location,
          image: null,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[A-Za-z]+$/, 'Username should contain only alphabets')
      .required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobile: Yup.string()
      .matches(/^\d{10}$/, 'Mobile number should be exactly 10 digits')
      .required('Mobile number is required'),
    location: Yup.string().required('Location is required'),
    image: Yup.mixed()
      .test('fileType', 'Only image files are allowed', (value) => {
        if (!value) return true; // Attachment is optional
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      }),
  });

  const formik = useFormik({
    initialValues: {
      adminId: '',
      username: '',
      email: '',
      mobile: '',
      location: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const updateData = new FormData();
        for (const key in values) {
          updateData.append(key, values[key]);
        }

        const response = await axios.put('http://localhost:3000/api/admin/profile', updateData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Profile Updated Successfully");
        console.log('Profile updated successfully:', response.data);
        setAdmin(response.data.admin);
        setIsEditing(false);
        setLoading(false);

      } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        toast.error(`Error: ${error.message}`);
      }
    },
  });

  const isValid = formik.isValid && formik.dirty;

  return (
    <>
    <ToastContainer/>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={admin.imageUrl || '/img/bruce-mars.jpeg'}
                alt={admin.username}
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {admin.username}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {admin.role || 'Admin'}
                </Typography>
              </div>
            </div>
            {isEditing ? (
              <Tooltip content="Cancel Edit">
                <GiCrossMark onClick={() => setIsEditing(false)} />
              </Tooltip>
            ) : (
              <Tooltip content="Edit Profile">
                <PencilIcon
                  className="h-4 w-4 cursor-pointer text-blue-gray-500"
                  onClick={() => setIsEditing(true)}
                />
              </Tooltip>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <Input
                    type="text"
                    name="username"
                    label="Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    required
                  />
                   {formik.touched.username && formik.errors.username ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formik.errors.username}
                </Typography>
              ) : null}
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    required
                  />
                   {formik.touched.email && formik.errors.email ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formik.errors.email}
                </Typography>
              ) : null}
                </div>
                <div>
                  <Input
                    type="text"
                    name="mobile"
                    label="Mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                    required
                  />
                   {formik.touched.mobile && formik.errors.mobile ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formik.errors.mobile}
                </Typography>
              ) : null}
                </div>
                <div>
                  <Input
                    type="text"
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                    required
                  />
                   {formik.touched.location && formik.errors.location ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formik.errors.location}
                </Typography>
              ) : null}
                </div>
                <div>
                  <Input
                    type="file"
                    name="image"
                    label="Profile Image"
                    onChange={(e) => formik.setFieldValue('image', e.target.files[0])}
                    onBlur={formik.handleBlur}
                    error={formik.touched.image && Boolean(formik.errors.image)}
                    helperText={formik.touched.image && formik.errors.image}
                  />
                   {formik.touched.image && formik.errors.image ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formik.errors.image}
                </Typography>
              ) : null}
                </div>
              </div>
              <Button type="submit" color="blue" disabled={!isValid}>
                  { loading ? <span> <center><ImSpinner6 className=" animate-spin " /></center> </span>: " Update Profile"}
              </Button>
            </form>
          ) : (
            <div className="grid-cols-1 mb-12 grid px-4 lg:grid-cols-1 xl:grid-cols-1">
              <ProfileInfoCard
                title="Profile Information"
                description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                details={{
                  Username: admin.username,
                  Mobile: admin.mobile,
                  Email: admin.email,
                  Location: admin.location,
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
