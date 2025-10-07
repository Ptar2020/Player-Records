// Register.jsx
"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ClubInterface, UserInterface } from "../../types";
import { showErrorMsg } from "@/app/_utils/Alert";

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
      <button className="btn btn-primary" onClick={register}>
        REGISTER
      </button>
    </div>
  );
};

export default Register;
// "use client";
// import React, { ChangeEvent, useEffect, useState } from "react";
// import { ClubInterface, UserInterface } from "../../types";
// import { showErrorMsg } from "@/app/_utils/Alert";

// const Register = () => {
//   const [clubs, setClubs] = useState<ClubInterface[]>([]);
//   const [userData, setUserData] = useState<UserInterface>({
//     username: "",
//     firstname: "",
//     lastname: "",
//     password: "",
//     password2: "",
//     email: "",
//     club: "",
//   });

//   const getClubs = async () => {
//     try {
//       const response = await fetch("/api/club");
//       const data = await response.json();
//       if (response.ok) {
//         setClubs(data);
//       } else {
//         showErrorMsg(data.msg);
//       }
//     } catch (error) {
//       showErrorMsg("Failed to fetch clubs");
//     }
//   };

//   useEffect(() => {
//     getClubs();
//   }, []);

//   const register = async () => {
//     const response = await fetch("/api/user/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(userData),
//     });
//     const data = await response.json();
//     console.log(data);
//   };

//   return (
//     <div className="text-center mt-2">
//       <p> USER REGISTRATION PAGE</p>
//       <div>
//         <input
//           placeholder="Firstname"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             setUserData({ ...userData, firstname: e.target.value });
//           }}
//         />
//         <br />
//         <input
//           placeholder="Lastname"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             setUserData({ ...userData, lastname: e.target.value });
//           }}
//         />
//         <br />
//         <input
//           placeholder="Username"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             setUserData({ ...userData, username: e.target.value });
//           }}
//         />
//         <br />
//         <input
//           placeholder="Email"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             setUserData({ ...userData, email: e.target.value });
//           }}
//         />
//         <br />{" "}
//         <select
//           onChange={(e: ChangeEvent<HTMLSelectElement>) => {
//             setUserData({ ...userData, club: e.target.value });
//           }}
//         >
//           <option selected disabled>
//             --Select Club--
//           </option>
//           {clubs.map((club) => (
//             <option key={club._id}>{club.name}</option>
//           ))}
//         </select>
//         <br />
//         <input
//           placeholder="Password"
//           type="password"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             setUserData({ ...userData, password: e.target.value });
//           }}
//         />
//         <br />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//             setUserData({ ...userData, password2: e.target.value });
//           }}
//         />
//         <br />
//         <br />
//         <button onClick={register}>REGISTER</button>
//       </div>
//     </div>
//   );
// };

// export default Register;
