"use client";

import { API } from "@/api/api";
import { APIQuery } from "@/api/queryMethod";
import Button from "@/components/button";
import Link from "next/link";

function UidVerify({ searchParams }) {
  if (searchParams?.uid) {
    const userVerify = APIQuery("userVerify", () =>
      API.userVerify(searchParams?.uid)
    );
    if (userVerify.isLoading) {
      return (
        <div className="totalcenter">
          <h2>Loading.....🕵️‍♂️</h2>
        </div>
      );
    } else if (userVerify.isError) {
      return (
        <div className="totalcenter">
          <h2>{userVerify.error?.data?.detail} 🪪</h2>
        </div>
      );
    } else {
      return (
        <div className="totalcenter">
          <h2>{userVerify.data?.data?.message} ✅</h2>
          <p>
            Your account is now verified. Simply log in to unlock a world of
            features
          </p>
          <Link href="/auth/signin">
            <Button value="sign in" />
          </Link>
        </div>
      );
    }
  } else {
    return (
      <div className="totalcenter">
        <h2>UID not found 🕵️‍♂️</h2>
        <Link href="/">back to home</Link>
      </div>
    );
  }
}

export default UidVerify;
