import React, { ChangeEvent, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
import { ClubInterface, PositionInterface } from "../types";

const PlayerForm = ({ clubs, setClubs, positions, setPositions }) => {
  const router = useRouter();
  const [playerData, setPlayerData] = useState({
    name: "",
    country: "",
    age: "",
    gender: "",
    club: "",
    position: "",
  });

  const getClubs = useCallback(async () => {
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
  }, [setClubs]);

  const getPositions = useCallback(async () => {
    try {
      const response = await fetch("/api/position");
      const data = await response.json();
      if (response.ok) {
        setPositions(data);
      } else {
        showErrorMsg(data.msg);
      }
    } catch (error) {
      showErrorMsg("Failed to fetch positions");
    }
  }, [setPositions]);

  const addPlayer = async () => {
    try {
      const response = await fetch("/api/player/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      });
      const data = await response.json();
      if (response.ok) {
        router.push(`/player/${data.player._id}`);
        showSuccessMsg(data.success);
        setPlayerData({
          name: "",
          country: "",
          age: "",
          gender: "",
          club: "",
          position: "",
        });
      } else {
        showErrorMsg(data.msg || "Failed to add player");
      }
    } catch (error) {
      showErrorMsg("An unexpected error occurred");
    }
  };

  return (
    <div className="form-card">
      <h2 className="subtitle">Add Player</h2>
      <div className="grid-gap-3">
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={playerData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPlayerData({ ...playerData, name: e.target.value })
          }
        />
        <div className="form-group-flex">
          <input
            className="input"
            type="number"
            placeholder="Age"
            value={playerData.age}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPlayerData({ ...playerData, age: e.target.value })
            }
          />
          <input
            className="input"
            type="text"
            placeholder="Country"
            value={playerData.country}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPlayerData({ ...playerData, country: e.target.value })
            }
          />
        </div>
        <div className="form-group-flex">
          <select
            className="select"
            value={playerData.gender}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPlayerData({ ...playerData, gender: e.target.value })
            }
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <select
            className="select"
            value={playerData.club}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPlayerData({ ...playerData, club: e.target.value })
            }
          >
            <option value="" disabled>
              Select Club
            </option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={playerData.position}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPlayerData({ ...playerData, position: e.target.value })
            }
          >
            <option value="" disabled>
              Select Position
            </option>
            {positions.map((position) => (
              <option key={position._id} value={position._id}>
                {position.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={addPlayer} className="btn btn-green">
          Save Player
        </button>
      </div>
    </div>
  );
};
export default PlayerForm;
