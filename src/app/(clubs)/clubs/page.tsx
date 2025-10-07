// ClubsPage.jsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { showErrorMsg } from "../../_utils/Alert";
import { ClubInterface } from "../../types";
import Link from "next/link";

const ClubsPage = () => {
  const [clubs, setClubs] = useState<ClubInterface[]>([]);

  const getClubs = useCallback(async () => {
    try {
      const response = await fetch("/api/club");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Failed to fetch clubs");
      }
      setClubs(data);
    } catch (error) {
      showErrorMsg(
        error instanceof Error ? error.message : "Error getting clubs"
      );
    }
  }, []);

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <div className="container">
      <p className="title">CLUBS</p>
      {clubs.map((club) => (
        <p key={club._id}>
          <Link className="link" href={`/${club.name}`}>
            {club.name}
          </Link>
        </p>
      ))}
    </div>
  );
};

export default ClubsPage;
