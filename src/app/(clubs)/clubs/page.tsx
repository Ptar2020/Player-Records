"use client";
import React, { useCallback, useEffect, useState } from "react";
import { showErrorMsg } from "../../_utils/Alert";
import { ClubInterface } from "../../types";
import Link from "next/link";
import ClubForm from "@/app/components/ClubForm";

const ClubsPage = () => {
  const [addClub, setAddClub] = useState(false);
  const [clubs, setClubs] = useState<ClubInterface[]>([]);

  const getClubs = useCallback(async () => {
    try {
      const response = await fetch("/api/club");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg);
      }
      setClubs(data);
    } catch (error) {
      showErrorMsg(
        error instanceof Error ? error.message : "Error getting clubs data"
      );
    }
  }, []);

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <div className="container max-w-2xl">
      <h3 className="title">
        REGISTERED CLUBS{" - "}
        {clubs.length}
      </h3>
      <button className="btn" onClick={() => setAddClub(!addClub)}>
        {!addClub ? "Add Club" : "Close"}
      </button>
      {addClub && <ClubForm />}
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="table-header">#</th>
            <th className="table-header">NAME</th>
            <th className="table-header">LEVEL</th>
            <th className="table-header">COUNTRY</th>
            <th className="table-header">PLAYERS</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club, index) => (
            <tr className="table-row" key={club._id}>
              <td className="table-cell">{index + 1}</td>
              <td className="table-cell">
                <Link className="link " href={`/${club._id}`}>
                  {club.name}
                </Link>
              </td>
              <td className="table-cell">{club.level}</td>
              <td className="table-cell">{club.country}</td>
              <td className="table-cell">{club?.players.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubsPage;
