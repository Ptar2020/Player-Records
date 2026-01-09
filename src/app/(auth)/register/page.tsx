"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ClubInterface, UserInterface } from "../../types";
import { showErrorMsg } from "@/app/_utils/Alert";
import Link from "next/link";

const Register = () => {
  const [clubs, setClubs] = useState<ClubInterface[]>([]);
  const [userData, setUserData] = useState<Partial<UserInterface>>({
    username: "",
    name: "",
    password: "",
    password2: "",
    email: "",
    club: "",
  });

  const getClubs = async () => {
    try {
      const response = await fetch("/api/club");
      const data = await response.json();
      if (response.ok) {
        setClubs(data);
      } else {
        showErrorMsg(data.msg);
      }
    } catch (error) {
      showErrorMsg("Failed to fetch clubs");
    }
  };

  useEffect(() => {
    getClubs();
  }, []);

  const register = async () => {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    console.log(userData);
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="form-container register-form">
      <p className="form-title">USER REGISTRATION PAGE</p>
      <input
        className="input"
        placeholder="Name"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, name: e.target.value });
        }}
      />

      <input
        className="input"
        placeholder="Username"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, username: e.target.value });
        }}
      />
      <input
        className="input"
        placeholder="Email"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, email: e.target.value });
        }}
      />
      <select
        className="select"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setUserData({ ...userData, club: e.target.value });
        }}
      >
        <option selected disabled>
          --Select Club--
        </option>
        {clubs.map((club) => (
          <option value={club._id} key={club._id}>
            {club.name}
          </option>
        ))}
      </select>
      <input
        className="input"
        placeholder="Password"
        type="password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, password: e.target.value });
        }}
      />
      <input
        className="input"
        type="password"
        placeholder="Confirm Password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, password2: e.target.value });
        }}
      />
      <div className="d-flex">
        <button className="btn btn-primary pr-4" onClick={register}>
          REGISTER
        </button>
        <Link href={"/login"} className="btn btn-primary">
          LOGIN
        </Link>
      </div>
    </div>
  );
};

export default Register;
