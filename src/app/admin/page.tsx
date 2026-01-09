"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { showErrorMsg } from "../_utils/Alert";
import { useAuth } from "../_utils/AuthProvider";
import { useRouter } from "next/navigation";
import { PositionInterface, UserInterface } from "../types";

import Register from "../(auth)/register/page";
import PositionForm from "../components/PositionForm";
import PlayerForm from "../components/PlayerForm";
import ClubForm from "../components/ClubForm";
import UsersForm from "../components/UsersForm";

const Admin = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserInterface[]>([]);
  const [positions, setPositions] = useState<PositionInterface[]>([]);
  const [clubSearchTerm, setClubSearchTerm] = useState<string>("");

  const [activeForm, setActiveForm] = useState<
    "users" | "player" | "club" | "position" | "register"
  >("users");

  const [editId, setEditId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to fetch users");
      }
      const data: UserInterface[] = await response.json();
      setUsers(data);
    } catch {
      showErrorMsg("Failed to fetch users");
    }
  }, []);

  const getPositions = useCallback(async () => {
    try {
      const response = await fetch("/api/position");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to fetch positions");
      }
      const data: PositionInterface[] = await response.json();
      setPositions(data);
    } catch {
      showErrorMsg("Failed to fetch positions");
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }
    getUsers();
    getPositions();
  }, [user]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setClubSearchTerm("");
    }
  }, []);

  useEffect(() => {
    const listener = (e: globalThis.MouseEvent) =>
      handleClickOutside(e as MouseEvent);
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [handleClickOutside]);

  const toggleForm = (
    form: "player" | "club" | "position" | "register" | "users"
  ) => {
    // Clicking the same button again → go back to users
    if (activeForm === form) {
      setActiveForm("users");
    } else {
      setActiveForm(form);
    }

    // Reset club search when opening/closing club form
    if (form === "club") {
      setClubSearchTerm("");
    }
  };

  return (
    <div className="container">
      <h1 className="title">ADMIN</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => toggleForm("users")}
          className={`btn ${activeForm === "users" ? "btn-blue" : "btn-green"}`}
        >
          {activeForm === "users" ? "Hide Users" : "View Users"}
        </button>

        <button onClick={() => toggleForm("club")} className="btn btn-green">
          {activeForm === "club" ? "Close Club" : "Add Club"}
        </button>

        <button onClick={() => toggleForm("player")} className="btn btn-green">
          {activeForm === "player" ? "Close Player" : "Add Player"}
        </button>

        <button
          onClick={() => toggleForm("register")}
          className="btn btn-green"
        >
          {activeForm === "register" ? "Close Register" : "Add User"}
        </button>

        <button
          onClick={() => toggleForm("position")}
          className="btn btn-green"
        >
          {activeForm === "position" ? "Close Position" : "Add Position"}
        </button>
      </div>

      {/* ---------- SINGLE VISIBLE SECTION ---------- */}
      <div className="form-card">
        {activeForm === "users" && (
          <UsersForm
            users={users}
            getUsers={getUsers}
            setUsers={setUsers}
            editId={editId}
            setEditId={setEditId}
          />
        )}

        {activeForm === "register" && <Register />}

        {activeForm === "player" && <PlayerForm />}

        {activeForm === "club" && (
          <div ref={dropdownRef}>
            <ClubForm
              clubSearchTerm={clubSearchTerm}
              setClubSearchTerm={setClubSearchTerm}
            />
          </div>
        )}

        {activeForm === "position" && (
          <PositionForm positions={positions} setPositions={setPositions} />
        )}
      </div>
    </div>
  );
};

export default Admin;
