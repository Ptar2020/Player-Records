
"use client";

import { useEffect, useState, useMemo } from "react";
import { PlayerInterface } from "./types";
import Link from "next/link";
import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
import { useAuth } from "./_utils/AuthProvider";
import swal from "sweetalert";
import PlayerForm from "./components/PlayerForm";

export default function Home() {
  const { user } = useAuth();
  const [addPlayer, setAddPlayer] = useState(false);
  const [players, setPlayers] = useState<PlayerInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch all players
  const getPlayers = async () => {
    try {
      setError(null);
      const response = await fetch("/api/player", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch players");

      const data: PlayerInterface[] = await response.json();
      setPlayers(data);
    } catch (err) {
      const msg = "Failed to fetch players";
      setError(msg);
      showErrorMsg(msg);
    }
  };

  // Delete player
  const deletePlayer = async (_id: string, name: string) => {
    const confirmed = await swal({
      title: `Delete ${name}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/player/${_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        showErrorMsg(data.msg || "Failed to delete player");
        return;
      }

      showSuccessMsg(`${name} deleted successfully`);
      await getPlayers(); // Refresh the list
    } catch (err) {
      showErrorMsg("Failed to delete player");
    }
  };

  // Instant client-side filtering — fast and responsive
  const filteredPlayers = useMemo(() => {
    if (!searchTerm.trim()) return players;

    const term = searchTerm.toLowerCase();
    return players.filter((player) =>
      player.name.toLowerCase().includes(term)
    );
  }, [players, searchTerm]);

  const toggleAddPlayer = () => {
    setAddPlayer((prev) => !prev);
  };

  // Called by PlayerForm after successful add
  const handlePlayerAdded = () => {
    showSuccessMsg("Player added successfully!");
    getPlayers(); // Refresh list
    setAddPlayer(false); // Close form
  };

  // Attach PlayerForm's success handler (assuming it accepts onSuccess prop)
  // If your PlayerForm doesn't have onSuccess yet, add it there and call it on success.

  useEffect(() => {
    getPlayers();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-600 text-xl mt-20" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container max-w-4xl">
      <h1 className="title">PLAYERS RECORDS</h1>

      {user && (
        <button className="btn" onClick={toggleAddPlayer}>
          {addPlayer ? "Close" : "Add Player"}
        </button>
      )}

      <div className="mb-4">
        <input
          className="input"
          type="text"
          placeholder="Search by player name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search players by name"
        />
      </div>

      {addPlayer && <PlayerForm onSuccess={handlePlayerAdded} />}

      {filteredPlayers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="table-header">#</th>
                <th className="table-header">Name</th>
                <th className="table-header">Age</th>
                <th className="table-header">Position</th>
                <th className="table-header">Club</th>
                <th className="table-header">Country</th>
                {user?.role === "admin" && (
                  <th className="table-header">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player: PlayerInterface, index) => (
                <tr key={player._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">
                    <Link href={`/player/${player._id}`} className="link">
                      {player.name}
                    </Link>
                  </td>
                  <td className="table-cell">{player.age}</td>
                  <td className="table-cell">{player.position?.name}</td>
                  <td className="table-cell">
                    <Link className="link" href={`/${player.club?._id}`}>
                      {player.club?.name}
                    </Link>
                  </td>
                  <td className="table-cell">{player.country}</td>
                  {user?.role === "admin" && (
                    <td className="table-cell">
                      <button
                        onClick={() => deletePlayer(player._id, player.name)}
                        className="btn btn-red"
                        aria-label={`Delete player ${player.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray" aria-live="polite">
          No players found
        </p>
      )}
    </div>
  );
}
