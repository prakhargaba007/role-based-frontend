"use client";
import { useEffect, useState } from "react";
import LoginOrSignUpPage from "@/components/LoginOrSignUpPage";
import classes from "./page.module.css";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      setIsLoggedIn(true);
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className={classes.container}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {isLoggedIn ? (
        <>
          {!data && <h2>Loading...</h2>}
          {data?.role === "user" && <h1>You are a user.</h1>}
          {data?.role === "admin" && <h1>You are an admin.</h1>}
          {data?.role === "delivery boy" && <h1>You are a delivery boy.</h1>}
        </>
      ) : (
        <LoginOrSignUpPage />
      )}
    </div>
  );
}
