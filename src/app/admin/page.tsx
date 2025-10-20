"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [users, setUsers] = useState<Partial<UserInterface>[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<
    "player" | "club" | "position" | "register" | "users" | null
  >(null);
  const [positions, setPositions] = useState<PositionInterface[]>([]);
  const [clubSearchTerm, setClubSearchTerm] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
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
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      showErrorMsg("Failed to fetch positions");
    }
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setClubSearchTerm("");
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }
    getUsers();
    getPositions();
  }, [user, getUsers, getPositions]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleForm = (
    form: "player" | "club" | "position" | "register" | "users"
  ) => {
    setActiveForm(activeForm === form ? null : form);
    if (form === "club") {
      setClubSearchTerm("");
    }
  };

  return (
    <div className="container">
      <h1 className="title">ADMIN</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => toggleForm("users")} className="btn btn-green">
          {activeForm === "users" ? "Close Users" : "View Users"}
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
          {activeForm === "register" ? "Close Register" : "Add user"}
        </button>
        <button
          onClick={() => toggleForm("position")}
          className="btn btn-green"
        >
          {activeForm === "position" ? "Close Position" : "Add Position"}
        </button>
      </div>
      {activeForm === "register" && (
        <div className="form-card">
          <Register />
        </div>
      )}
      {activeForm === "player" && (
        <div className="form-card">
          <PlayerForm />
        </div>
      )}
      {activeForm === "club" && (
        <ClubForm
          clubSearchTerm={clubSearchTerm}
          setClubSearchTerm={setClubSearchTerm}
        />
      )}
      {activeForm === "position" && (
        <PositionForm positions={positions} setPositions={setPositions} />
      )}
      {activeForm === "users" && (
        <UsersForm
          users={users}
          getUsers={getUsers}
          setUsers={setUsers}
          editId={editId}
          setEditId={setEditId}
        />
      )}
    </div>
  );
};

export default Admin;
