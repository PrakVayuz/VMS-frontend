import React, { useEffect, useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import { ImSpinner6 } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY, { action: "login" })
            .then(token => formik.setFieldValue("recaptchaToken", token));
        });
      }
    };

    loadRecaptcha();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      recaptchaToken: null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(2, "Username must be at least 2 characters")
        .matches(/^[a-zA-Z0-9]*$/, "No special characters or spaces allowed"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .matches(/^\S*$/, "No spaces allowed")
        ,
    }),
    onSubmit: async (values) => {

      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/api/admin/login", {
          username: values.username,
          password: values.password,
          recaptchaToken: values.recaptchaToken,
        });

        localStorage.setItem("token", response.data.token);
        toast.success("Sign in successful!");
        setLoading(false);
       
        setTimeout(() => {
          navigate("/dashboard/profile");
        }, 1000); 
      } catch (error) {

        toast.error("Error logging in");
        setLoading(false);
      }
    },
  });

  const executeRecaptchaAndSubmit = async (e) => {
    e.preventDefault();
    if (window.grecaptcha) {
      window.grecaptcha.ready(async () => {
        const token = await window.grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY, { action: "login" });
        formik.setFieldValue("recaptchaToken", token);
        formik.submitForm();
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <ToastContainer/>
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your username and password to Sign In.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={executeRecaptchaAndSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your username
            </Typography>
            <Input
              size="lg"
              placeholder="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              autoComplete="username"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {formik.touched.username && formik.errors.username ? (
              <Typography variant="small" color="red" className="-mb-3">
                {formik.errors.username}
              </Typography>
            ) : null}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="********"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                autoComplete="current-password"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={toggleShowPassword}>
                {showPassword ? <BsEye /> : <BsEyeSlash/>  }
              </div>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <Typography variant="small" color="red" className="-mb-3">
                {formik.errors.password}
              </Typography>
            ) : null}
          </div>
          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={formik.isSubmitting || !formik.isValid}
          >
            { loading ? <span> <center><ImSpinner6 className=" animate-spin " /></center> </span>: " Sign In"}
          </Button>
          <Link to="/auth/forgot-password" className="block mt-4 text-blue-500">
            Forgot Password?
          </Link>
        </form>
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

export default SignIn;
