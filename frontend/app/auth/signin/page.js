"use client";

import { API } from "@/api/api";
import LoadingBar from "@/components/loadingEffect";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "@/styles/auth/signin.scss";
import Link from "next/link";
import { Toast } from "@/components/alert";

function signin() {
  const [showPassword, SetShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    SetShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const router = useRouter();
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const signin = await API.signin(data).catch((err) => {
        Toast.error(err?.data?.message);
        setLoading(false);
      });
      if (signin.data?.status) {
        Toast.success(signin.data?.message);
        const token = signin.data?.authorization.split("Bearer").splice(1)[0];
        if (token) {
          window.sessionStorage.setItem(
            "token",
            signin.data?.authorization.split("Bearer").splice(1)[0]
          );
          document.cookie = `token=${token};path=/`;
          setTimeout(() => {
            router.push(`/${signin.data?.username}`);
          }, 1000);
        } else {
          Toast.error("somthing went wrong contact admin");
        }
      } else {
        Toast.error(signin?.message);
      }
      setLoading(false);
    } catch (error) {
      Toast.error(signin?.message);
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-container-left">
        <div className="signup-logo">
          <img alt="" src="/logo.png" width="50px" />
          <h1>YoungStorage</h1>
          <h4>Login Into Your Account</h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form">
            <div className="left-comp">
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
                  </svg>
                </span>
              </div>
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email?.message}</p>
              )}
            </div>

            <div className="left-comp">
              <label>Password:</label>
              <div className="icons">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
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
                  </svg>
                </span>
              </div>
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password.message}</p>
              )}
            </div>
          </div>
          <span className="forgotpassword">
            <Link href="/auth/forgot">forgot password?</Link>
          </span>
          <button className="btn">
            {loading ? <LoadingBar /> : "Sign in"}
          </button>
          {/* <input className="btn" value="Submit" type="submit" /> */}

          <div className="line">
            <hr />
            <span>or</span>
          </div>

          <div className="btn1">
            <Link href="/auth/signup">Signup Now</Link>
          </div>
        </form>
      </div>
      {/* right side png */}
      <div className="form-container-right">
        <img alt="" src="/Mobile.png" />
      </div>
    </div>
  );
}

export default signin;
