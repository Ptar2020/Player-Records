// Navbar.jsx
"use client";
import Link from "next/link";
import React from "react";
import { showSuccessMsg, showErrorMsg } from "../_utils/Alert";
import { useRouter } from "next/navigation";
import { useAuth } from "../_utils/AuthProvider";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const logOut = async () => {
    const confirmed = await swal({
      title: "Confirm to log out",
      icon: "warning",
      buttons: ["Cancel", "Ok"],
      dangerMode: true,
    });

    if (confirmed) {
      try {
        const res = await fetch("/api/user/logout", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        setUser(null);
        router.push("/login");
        showSuccessMsg(data.success);
      } catch (error) {
        showErrorMsg(
          error instanceof Error ? error.message : "Error logging out"
        );
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link className="nav-link" href="/">
            Home
          </Link>
          <Link className="nav-link" href="/clubs">
            Clubs
          </Link>
          {user?.role === "coach" ||
            (user?.role === "admin" && (
              <Link className="nav-link" href="/admin">
                {user.username}
              </Link>
            ))}
        </div>
        <div className=" nna navbar-right">
          {user ? (
            <button className="nav-link-button" onClick={logOut}>
              Logout {user?.role}
            </button>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="nav-link" href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// "use client";
// import Link from "next/link";
// import React from "react";
// import { showSuccessMsg, showErrorMsg } from "../_utils/Alert";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../_utils/AuthProvider";

// const Navbar = () => {
//   const { user, setUser } = useAuth();
//   const router = useRouter();

//   const logOut = async () => {
//     const confirmed = await swal({
//       title: "Confirm to log out",
//       icon: "warning",
//       buttons: ["Cancel", "Ok"],
//       dangerMode: true,
//     });

//     if (confirmed) {
//       try {
//         const res = await fetch("/api/user/logout", {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         });
//         const data = await res.json();
//         setUser(null);
//         router.push("/login");
//         showSuccessMsg(data.success);
//       } catch (error) {
//         showErrorMsg(
//           error instanceof Error ? error.message : "Error logging out"
//         );
//       }
//     }
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <div className="flex space-x-4">
//           <Link
//             className="text-gray-700 hover:text-blue-500 transition-colors"
//             href="/"
//           >
//             Home
//           </Link>
//           <Link
//             className="text-gray-700 hover:text-blue-500 transition-colors"
//             href="/clubs"
//           >
//             Clubs
//           </Link>
//           {user?.role === "coach" ||
//             (user?.role === "admin" && (
//               <Link
//                 className="text-gray-700 hover:text-blue-500 transition-colors"
//                 href="/admin"
//               >
//                 {user.username}
//               </Link>
//             ))}
//         </div>
//         <div className="flex space-x-4">
//           {user ? (
//             <button
//               className="text-gray-700 hover:text-blue-500 transition-colors"
//               onClick={logOut}
//             >
//               Logout
//             </button>
//           ) : (
//             <>
//               <Link
//                 className="text-gray-700 hover:text-blue-500 transition-colors"
//                 href="/login"
//               >
//                 Login
//               </Link>
//               <Link
//                 className="text-gray-700 hover:text-blue-500 transition-colors"
//                 href="/register"
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
