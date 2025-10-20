"use client";
import { showErrorMsg } from "@/app/_utils/Alert";
import { ClubInterface } from "@/app/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Club = () => {
  const { name } = useParams<{ name: string }>();
  const [clubData, setClubData] = useState<ClubInterface>();
  const [loading, setLoading] = useState(true);

  const getClubData = async () => {
    try {
      const response = await fetch(`/api/club/${encodeURIComponent(name)}`);
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        showErrorMsg(data.msg);
      } else {
        setClubData(data);
      }
    } catch (error) {
      showErrorMsg(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClubData();
  }, []);

  return (
    <div className="container max-w-3xl">
      {loading ? (
        <p className="text-center">Loading club data...</p>
      ) : !clubData ? (
        <p>Club not found.</p>
      ) : (
        <>
          <h2 className="text-center">
            {clubData.name}
            <small>
              [{clubData.country} - {clubData.level}]
            </small>
          </h2>
          {clubData.players && clubData.players.length > 0 ? (
            <table className="table">
              <thead className="thead">
                <tr>
                  <th className="table-header">#</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Age</th>
                  <th className="table-header">Position</th>
                  <th className="table-header">Country</th>
                </tr>
              </thead>
              <tbody>
                {clubData.players.map((player, index) => (
                  <tr key={player._id} className="table-row">
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">
                      <Link className="link" href={`/player/${player._id}`}>
                        {player.name}
                      </Link>
                    </td>
                    <td className="table-cell">{player.age}</td>
                    <td className="table-cell">{player.position?.name}</td>
                    <td className="table-cell">{player.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No players registered in this club yet</p>
          )}
        </>
      )}
    </div>
  );
};

export default Club;
