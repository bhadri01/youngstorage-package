"use client";
import Button from "@/components/button";
import Link from "next/link";
import "@/styles/app.scss";
import { Toast } from "@/components/alert";

export default function Home() {
  return (
    <div className="app-container">
      <div className="header">
        <h1>
          <img alt="" src="/logo.png" width={50} />
          YoungStorage labs
        </h1>
        <div className="end">
          <Link href="/auth/signin">
            <Button value="sign in" />
          </Link>

          <Link href="/auth/signup">
            <Button value="Sign Up" />
          </Link>
        </div>
      </div>
      <div className="center">
        <span>welcome to YoungStorage labs</span>
        <span>state of the art laboratries at the hand and home of every</span>
        <h4>learn!</h4>
        <Link href="/dashboard">
          <Button value="Get Started" />
        </Link>
      </div>
    </div>
  );
}
