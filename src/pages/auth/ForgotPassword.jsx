import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ImSpinner6 } from 'react-icons/im';

export function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResendOtp(true);
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const emailSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const otpSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
    newPassword: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .matches(/^\S*$/, "No spaces allowed")
        ,
  });

  const formikEmail = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.post('https://vms-backend-1yet.onrender.com/api/admin/send-otp', { email: values.email });
        setStep(2);
        setTimer(600); // Reset timer to 10 minutes
        setIsTimerActive(true);
        setCanResendOtp(false);
        setLoading(false);
        toast.success("Email Sent");
      } catch (error) {
        console.error('Error sending OTP:', error);
        toast.error(`Error: ${error.message}`);
        setLoading(false);
        // Handle error (e.g., show error message)
      }
    },
  });

  const formikOtp = useFormik({
    initialValues: {
      otp: '',
      newPassword: '',
    },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.post('http://localhost:3000/api/admin/verify-otp', {
          email: formikEmail.values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        setStep(3);
        toast.success("Password Updated Successfully");
        setLoading(false);

        setTimeout(() => {
          navigate("/auth/sign-in");
        }, 3000); 
      } catch (error) {
        toast.error(`Error: ${error.message}`);
        console.error('Error verifying OTP and updating password:', error);
        setLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/admin/send-otp', { email: formikEmail.values.email });
      setTimer(600); 
      setIsTimerActive(true);
      setCanResendOtp(false);
      toast.success("OTP Sent");
      setLoading(false);
    } catch (error) {
      console.error('Error resending OTP:', error);
      setLoading(false);
      // Handle error (e.g., show error message)
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
    <ToastContainer/>
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Password Updated'}
          </Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            {step === 1 ? 'Enter your email to receive an OTP.' : step === 2 ? 'Enter the OTP sent to your email and your new password.' : 'Your password has been updated successfully.'}
          </Typography>
        </div>
        {step === 1 && (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={formikEmail.handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                name="email"
                value={formikEmail.values.email}
                onChange={formikEmail.handleChange}
                onBlur={formikEmail.handleBlur}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {formikEmail.touched.email && formikEmail.errors.email ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formikEmail.errors.email}
                </Typography>
              ) : null}
            </div>
            <Button
              type="submit"
              className="mt-6"
              fullWidth
              disabled={formikEmail.isSubmitting || !formikEmail.isValid}
            >
              { loading ? <span> <center><ImSpinner6 className=" animate-spin " /></center> </span>: " Send Otp"}
            </Button>
          </form>
        )}
        {step === 2 && (
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={formikOtp.handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                OTP
              </Typography>
              <Input
                size="lg"
                placeholder="Enter OTP"
                name="otp"
                value={formikOtp.values.otp}
                onChange={formikOtp.handleChange}
                onBlur={formikOtp.handleBlur}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {formikOtp.touched.otp && formikOtp.errors.otp ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formikOtp.errors.otp}
                </Typography>
              ) : null}
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                New Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                name="newPassword"
                value={formikOtp.values.newPassword}
                onChange={formikOtp.handleChange}
                onBlur={formikOtp.handleBlur}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {formikOtp.touched.newPassword && formikOtp.errors.newPassword ? (
                <Typography variant="small" color="red" className="-mb-3">
                  {formikOtp.errors.newPassword}
                </Typography>
              ) : null}
            </div>
            <Button
              type="submit"
              className="mt-6"
              fullWidth
              disabled={formikOtp.isSubmitting || !formikOtp.isValid}
            >
               { loading ? <span> <center><ImSpinner6 className=" animate-spin " /></center> </span>: "Verify OTP and Update Password"}
            </Button>
            <div className="text-center mt-4">
              <Typography variant="small" color="blue-gray">
                {isTimerActive ? `Resend OTP in ${formatTime(timer)}` : ''}
              </Typography>
              <Button
                type="button"
                className="mt-2"
                disabled={!canResendOtp}
                onClick={handleResendOtp}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        )}
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
    </>
  );
}

export default ForgotPassword;
