"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { API } from "@/api/api";
import LoadingBar from "@/components/loadingEffect";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/auth/signup.scss";
import { Toast } from "@/components/alert";

function signup() {
  const [showPassword, SetShowPassword] = useState(false);
  const [match, SetMatch] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    SetShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const Visible = () => {
    SetMatch((prevmatch) => !prevmatch);
  };

  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    if (data.password == data.confirmpassword) {
      const signupData = await API.signup(data).catch((err) => {
        Toast.error(
          err?.data?.message
            ? err?.data?.message
            : err?.data?.detail?.length
            ? err?.data?.detail[0]?.msg
            : err?.data?.detail
        );
        setLoading(false);
      });
      setLoading(false);
      if (signupData?.data) {
        let signdata = signupData?.data;
        if (signdata?.status) {
          Toast.success(signdata?.message);
          setTimeout(() => {
            router.push(`/auth/verify?email=${data?.email}`);
          }, 2000);
        } else {
          Toast.error(signdata?.message);
        }
      }
    } else {
      Toast.error(
        "please check the password and confirm password doesn't match"
      );
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img alt="" src="/signup.png" />
      </div>

      <div className="signup-right">
        <div className="signup-logo">
          <img alt="" src="/logo.png" width="50px" />
          <h1>YoungStorage</h1>
          <h4>Create New Account</h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="sign">
            <div className="right-comp">
              <label htmlFor="email">email:</label>
              <div className="icons">
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  required
                  {...register("email", {
                    required: "email required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                      message: "invalid email format",
                    },
                  })}
                />
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="26"
                    viewBox="0 0 25 26"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_115_17)">
                      <path
                        d="M3.05562 3.8418L21.2307 3.8418C21.4985 3.8418 21.7553 3.94818 21.9447 4.13754C22.134 4.3269 22.2404 4.58373 22.2404 4.85152V21.0071C22.2404 21.2749 22.134 21.5318 21.9447 21.7211C21.7553 21.9105 21.4985 22.0169 21.2307 22.0169H3.05562C2.78783 22.0169 2.531 21.9105 2.34164 21.7211C2.15228 21.5318 2.0459 21.2749 2.0459 21.0071L2.0459 4.85152C2.0459 4.58373 2.15228 4.3269 2.34164 4.13754C2.531 3.94818 2.78783 3.8418 3.05562 3.8418ZM20.221 8.12102L12.2159 15.2901L4.06535 8.0988L4.06535 19.9974H20.221V8.12102ZM4.58132 5.86125L12.2048 12.588L19.7181 5.86125L4.58132 5.86125Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_115_17">
                        <rect
                          width="24.2334"
                          height="24.2334"
                          fill="white"
                          transform="translate(0.0267944 0.8125)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
              <p style={{ color: "red" }}>{errors.email?.message}</p>
            </div>

            <div className="right-comp">
              <label>password:</label>
              <div className="icons">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                  )}
                  rules={{
                    required: "password required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
                    },
                  }}
                />
                <span onClick={togglePasswordVisibility}>
                  <img
                    src={showPassword ? "/shared.png" : "/hide.png"}
                    width={15}
                    height={15}
                  />
                </span>

                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                      stroke="#F1F3F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 10H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V10Z"
                      stroke="#F1F3F6"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="14.5"
                      y="15.5"
                      width="0.01"
                      height="0.01"
                      stroke="#F1F3F6"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                </span>
              </div>
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password.message}</p>
              )}
            </div>

            <div className="right-comp">
              <label>confirm Password:</label>
              <div className="icons">
                <Controller
                  name="confirmpassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={match ? "text" : "password"}
                      placeholder="confirm password"
                    />
                  )}
                  rules={{
                    required: "Please confirm your password",
                  }}
                />
                <span onClick={Visible}>
                  <img
                    src={match ? "/shared.png" : "/hide.png"}
                    width={15}
                    height={15}
                  />
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
                      stroke="#F1F3F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 10H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V10Z"
                      stroke="#F1F3F6"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="14.5"
                      y="15.5"
                      width="0.01"
                      height="0.01"
                      stroke="#F1F3F6"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              {errors.confirmpassword && (
                <p style={{ color: "red" }}>{errors.confirmpassword.message}</p>
              )}
            </div>

            <div className="right-comp">
              <label>Phone Number:</label>
              <div className="icons">
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      placeholder="Phone Number"
                    />
                  )}
                  rules={{
                    required: "phoneNumber required",
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                    maxLength: {
                      value: 12,
                      message: "Phone number must be at most 12 digits",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Phone number must contain only digits",
                    },
                  }}
                />
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M19.5063 7.95952C18.0666 13.6147 13.6147 18.0666 7.95953 19.5063C5.81867 20.0513 4 18.2091 4 16V15C4 14.4477 4.44883 14.0053 4.99842 13.9508C5.92696 13.8587 6.81815 13.6397 7.65438 13.3112L9.17366 14.8305C11.6447 13.648 13.648 11.6447 14.8305 9.17367L13.3112 7.65438C13.6397 6.81816 13.8587 5.92696 13.9508 4.99842C14.0053 4.44883 14.4477 4 15 4H16C18.2091 4 20.0513 5.81867 19.5063 7.95952Z"
                      stroke="#F1F3F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              {errors.phoneNumber && (
                <p style={{ color: "red" }}>{errors.phoneNumber}</p>
              )}
            </div>
            <button className="btn">
              {loading ? <LoadingBar /> : "Sign up"}
            </button>

            <div className="line">
              <hr />
              <span>or</span>
            </div>

            <div className="btn1">
              <Link href="/auth/signin">Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default signup;
