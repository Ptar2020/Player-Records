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
