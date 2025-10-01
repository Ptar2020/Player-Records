// Login.jsx
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { UserInterface } from "../../types";
import { useAuth } from "@/app/_utils/AuthProvider";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [userData, setUserData] = useState<Partial<UserInterface>>({
    username: "",
    password: "",
  });

  const loginUser = async () => {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log(data);
    setUser(data);
    router.push("/");
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="form-container">
      <h3 className="form-title">LOGIN PAGE</h3>
      <label>Username</label>
      <input
        className="input"
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, username: e.target.value });
        }}
      />
      <label>Password</label>
      <input
        className="input"
        type="password"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setUserData({ ...userData, password: e.target.value });
        }}
      />
      <button className="btn btn-primary" onClick={loginUser}>
        LOGIN
      </button>
    </div>
  );
};

export default Login;
// "use client";
// import React, { ChangeEvent, useEffect, useState } from "react";
// import { UserInterface } from "../../types";
// import { useAuth } from "@/app/_utils/AuthProvider";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const router = useRouter();
//   const { user, setUser } = useAuth();
//   const [userData, setUserData] = useState<Partial<UserInterface>>({
//     username: "",
//     password: "",
//   });

//   const loginUser = async () => {
//     const response = await fetch("/api/user/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     });
//     const data = await response.json();
//     console.log(data);
//     setUser(data);
//     router.push("/");
//   };

//   useEffect(() => {
//     if (user) {
//       router.push("/");
//     }
//   }, [user]);

//   return (
//     <div>
//       <h3>LOGIN PAGE</h3>
//       Username
//       <input
//         type="text"
//         onChange={(e: ChangeEvent<HTMLInputElement>) => {
//           setUserData({ ...userData, username: e.target.value });
//         }}
//       />
//       <br />
//       Password
//       <input
//         type="password"
//         onChange={(e: ChangeEvent<HTMLInputElement>) => {
//           setUserData({ ...userData, password: e.target.value });
//         }}
//       />
//       <br />
//       <button onClick={loginUser}>LOGIN</button>
//     </div>
//   );
// };

// export default Login;
