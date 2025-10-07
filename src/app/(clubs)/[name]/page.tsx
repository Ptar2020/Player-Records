"use client";
import { showErrorMsg } from "@/app/_utils/Alert";
import { useAuth } from "@/app/_utils/AuthProvider";
import { ClubInterface } from "@/app/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Club = () => {
  const { user } = useAuth();
  const { name } = useParams<{ name: string }>();
  const [clubData, setClubData] = useState<ClubInterface>();

  const getClubData = async () => {
    const response = await fetch(`/api/club/${name}`);
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      showErrorMsg(data.msg);
    } else {
      setClubData(data);
    }
  };
  useEffect(() => {
    getClubData();
  }, []);

  return (
    <div>
      <h2 className="text-center">{clubData?.name}</h2>
      <p>{clubData?.country}</p>
      <p>{clubData?.level}</p>
      {clubData?.players.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Position</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {clubData?.players.map((player, index) => (
              <tr key={player._id}>
                <td>{index + 1}</td>
                <td>
                  <Link className={"link"} href={`/player/${player._id}`}>
                    {player.name}
                  </Link>{" "}
                </td>
                <td>{player.age}</td>
                <td>{player.position.name}</td>
                <td>{player.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Club;
