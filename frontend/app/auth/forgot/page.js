"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { API } from "@/api/api";
import LoadingBar from "@/components/loadingEffect";
import { useRouter } from "next/navigation";
import "@/styles/auth/forgot.scss";
import { Toast } from "@/components/alert";

function forget() {
  const router = useRouter();
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const forgotpassword = await API.forgotpassword(data).catch((err) => {
      Toast.error(err?.data?.message);
      setLoading(false);
    });
    setLoading(false);
    if (forgotpassword?.data) {
      let forgotpass = forgotpassword?.data;
      if (forgotpass?.status) {
        Toast.success(forgotpass?.message);
        setTimeout(() => {
          router.push(`/auth/verify?email=${data?.email}`);
        }, 1000);
      } else {
        Toast.success(forgotpass?.message);
      }
    }
  };

  return (
    <div className="forget-container">
      <div className="forget-container-left">
        <div className="header-logo">
          <img alt="" src="/logo.png" />
          <h1>Forgot Password?</h1>
          <h4>
            Expect password reset instructions by email 📬. Follow the steps to
            proceed. Thanks!
          </h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form">
            <div className="forget-comp">
              <label htmlFor="email">email Address:</label>
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
          </div>
          <button className="btn">{loading ? <LoadingBar /> : "Verify"}</button>
          <div className="line">
            <hr />
            <span>or</span>
          </div>
          <div className="btn1">
            <Link href="/auth/signin">Back To Login</Link>
          </div>
        </form>
      </div>
      <div className="form-container-right">
        <img alt="" src="/back.png" />
      </div>
    </div>
  );
}

export default forget;
