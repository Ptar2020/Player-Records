"use client";

import { showErrorMsg } from "@/app/_utils/Alert";
import { ClubInterface } from "@/app/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Club = () => {
  const { _id } = useParams<{ _id: string }>();
  const [clubData, setClubData] = useState<ClubInterface>();
  const [loading, setLoading] = useState(true);

  const getClubData = async () => {
    try {
      const response = await fetch(`/api/club/${_id}`);
      const data = await response.json();

      if (!response.ok) {
        showErrorMsg(data.msg ?? "Failed to load club data");
      } else {
        setClubData(data);
      }
    } catch (error) {
      // Fixed syntax error – proper ternary inside the function call
      showErrorMsg(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
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
          <h2 className="text-center text-3xl font-bold mb-6">
            {clubData.name}
            <small className="block text-lg text-gray-600">
              [{clubData.country} - {clubData.level}]
            </small>
          </h2>

          {clubData.players && clubData.players.length > 0 ? (
            <table className="table w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="table-header p-3 text-left">#</th>
                  <th className="table-header p-3 text-left">Name</th>
                  <th className="table-header p-3 text-left">Age</th>
                  <th className="table-header p-3 text-left">Position</th>
                  <th className="table-header p-3 text-left">Country</th>
                </tr>
              </thead>
              <tbody>
                {clubData.players.map((player, index) => (
                  <tr key={player._id} className="table-row border-b hover:bg-gray-50">
                    <td className="table-cell p-3">{index + 1}</td>
                    <td className="table-cell p-3">
                      <Link className="link text-blue-600 hover:underline" href={`/player/${player._id}`}>
                        {player.name}
                      </Link>
                    </td>
                    <td className="table-cell p-3">{player.age}</td>
                    <td className="table-cell p-3">{player.position?.name ?? "-"}</td>
                    <td className="table-cell p-3">{player.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600">No players registered in this club yet</p>
          )}
        </>
      )}
    </div>
  );
};

export default Club;