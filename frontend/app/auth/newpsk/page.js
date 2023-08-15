"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { API } from "@/api/api";
import LoadingBar from "@/components/loadingEffect";
import Alert from "@/components/alert";
import { useRouter } from "next/navigation";
import "@/styles/auth/newpsk.scss";
import { Toast } from "@/components/alert";

const newpsk = ({ searchParams }) => {
  const router = useRouter();
  if (searchParams?.uid) {
    const form = useForm();
    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;
    const [Pass, SetPass] = useState(false);
    const [self, SetSelf] = useState(false);

    const [loading, setLoading] = useState(false);
    const handlePass = () => {
      SetPass((prevpass) => !prevpass);
    };
    const handleSelf = () => {
      SetSelf((self) => !self);
    };

    const onSubmit = async (data) => {
      setLoading(true);
      if (data?.password != data?.confirmpassword) {
        Toast.error("password and confirm does not match");
        setLoading(false);
        return;
      }
      const changpassword = await API.changepassword(
        data,
        searchParams?.uid
      ).catch((err) => {
        Toast.error(err?.data?.detail + ". Please verify your email again.");
        setLoading(false);
      });
      setLoading(false);
      if (changpassword?.data) {
        let changpass = changpassword?.data;
        if (changpass?.status) {
          Toast.success(changpass?.message);
          setTimeout(() => {
            router.push(`/auth/signin`);
          }, 2000);
        } else {
          Toast.error(changpass?.message + ". Please verify your email again.");
        }
      }
    };

    return (
      <div className="password-container">
        <div className="psk-container-left">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="header-logo">
              <img alt="" src="/logo.png" />
              <h1>New Password</h1>
              <h3>update your password and enjoy your service</h3>
            </div>
            <div className="psk">
              <div className="psk-comp">
                <label>Password</label>
                <div className="icons">
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type={Pass ? "text" : "password"}
                        placeholder="password"
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
                  <span onClick={handlePass}>
                    <img
                      src={Pass ? "/shared.png" : "/hide.png"}
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
              </div>
              <div className="psk-comp">
                <label>Confirm Password</label>
                <div className="icons">
                  <Controller
                    name="confirmpassword"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type={self ? "text" : "password"}
                        placeholder="confirmpassword"
                      />
                    )}
                    rules={{
                      required: "Please confirm your password",
                    }}
                  />
                  <span onClick={handleSelf}>
                    <img
                      src={self ? "/shared.png" : "/hide.png"}
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
              <button className="btn" onClick={handleSubmit}>
                {loading ? <LoadingBar /> : "Change password"}
              </button>
              <div className="line">
                <hr />
                <span>or</span>
              </div>

              <div className="btn1">
                <Link href="/auth/forgot">verify email</Link>
              </div>
            </div>
          </form>
        </div>
        <div className="psk-container-right">
          <div className="psk-right">
            <img alt="" src="/back2.png" />
          </div>
        </div>
      </div>
    );
  } else {
    <>Please Provide the Token!!</>;
  }
};

export default newpsk;
