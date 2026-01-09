"use client";
import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
import { useAuth } from "@/app/_utils/AuthProvider";
import { ClubInterface, PlayerInterface, PositionInterface } from "@/app/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

const Player: React.FC = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<ClubInterface[]>([]);
  const [details, setDetails] = useState<Partial<PlayerInterface>>({
    name: "",
    age: 0,
    country: "",
    club: undefined,
    gender: "",
    position: undefined,
  });
  const [positions, setPositions] = useState<PositionInterface[]>([]);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { _id } = useParams<{ _id: string }>();

  const getClubs = useCallback(async () => {
    try {
      const response = await fetch("/api/club");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg);
      }
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      showErrorMsg(
        error instanceof Error ? error.message : "Failed to fetch clubs"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPositions = useCallback(async () => {
    try {
      const response = await fetch("/api/position");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg);
      }
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      showErrorMsg(
        error instanceof Error ? error.message : "Failed to fetch positions"
      );
    }
  }, []);

  const getDetails = useCallback(async () => {
    if (!_id) return;
    try {
      const response = await fetch(`/api/player/${_id}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg);
      }
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      showErrorMsg(
        error instanceof Error
          ? error.message
          : "Failed to fetch player details"
      );
    } finally {
      setIsLoading(false);
    }
  }, [_id]);

  const updatePlayer = useCallback(async () => {
    if (
      !details.name ||
      !details.country ||
      details?.age <= 0 ||
      !details.gender ||
      !details.club ||
      !details.position
    ) {
      showErrorMsg("Please fill in all required fields correctly");
      return;
    }
    try {
      const response = await fetch(`/api/player/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(details),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to update player");
      }
      const data = await response.json();
      showSuccessMsg(data.success || "Player updated successfully");
      setEdit(false);
      await getDetails();
    } catch (error) {
      showErrorMsg("Failed to update player");
    } finally {
      setIsLoading(false);
    }
  }, [_id, details, getDetails]);

  useEffect(() => {
    getDetails();
    getClubs();
    getPositions();
  }, [getDetails, getClubs, getPositions]); // Added getPositions to deps

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setDetails((prev) => ({
        ...prev,
        [name]: name === "age" ? parseInt(value, 10) || 0 : value,
      }));
    },
    []
  );
  if (!details?.name) {
    return (
      <div className="text-center" aria-live="polite">
        <h3> Loading player data...</h3>
      </div>
    );
  }
  // if (isLoading) {
  //   return (
  //     <div className="text-center" aria-live="polite">
  //       <h3> Loading player data...</h3>
  //     </div>
  //   );
  // }

  return (
    <div className="container max-w-2xl">
      <h1 className="title">PLAYER PROFILE</h1>
      <div className="flex justify-between mb-6">
        <button
          onClick={() => history.back()}
          className="btn btn-gray"
          aria-label="Go back"
        >
          Back
        </button>
        {(user?.role === "admin" || user?.role === "coach") && (
          <button
            onClick={() => setEdit(!edit)}
            className={`btn ${edit ? "btn-red" : "btn-green"}`}
            disabled={isLoading}
            aria-label={edit ? "Cancel editing" : "Edit player profile"}
          >
            {edit ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            <tr className="table-row">
              <th className="table-header">Name</th>
              <td className="table-cell">
                {edit ? (
                  <input
                    className="input"
                    type="text"
                    name="name"
                    value={details.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    required
                    aria-label="Player name"
                  />
                ) : (
                  <span>{details.name}</span>
                )}
              </td>
            </tr>
            <tr className="table-row">
              <th className="table-header">Age</th>
              <td className="table-cell">
                {edit ? (
                  <input
                    className="input"
                    type="number"
                    name="age"
                    value={details.age}
                    onChange={handleInputChange}
                    min="1"
                    required
                    aria-label="Player age"
                  />
                ) : (
                  <span>{details.age}</span>
                )}
              </td>
            </tr>
            <tr className="table-row">
              <th className="table-header">Country</th>
              <td className="table-cell">
                {edit ? (
                  <input
                    className="input"
                    type="text"
                    name="country"
                    value={details.country}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    required
                    aria-label="Player country"
                  />
                ) : (
                  <span>{details.country}</span>
                )}
              </td>
            </tr>
            <tr className="table-row">
              <th className="table-header">Gender</th>
              <td className="table-cell">
                {edit ? (
                  <select
                    className="select"
                    name="gender"
                    value={details.gender}
                    onChange={handleInputChange}
                    required
                    aria-label="Select gender"
                  >
                    <option value="" disabled>
                      --Select Gender--
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span>{details.gender || ""}</span>
                )}
              </td>
            </tr>
            <tr className="table-row">
              <th className="table-header">Club</th>
              <td className="table-cell">
                {edit ? (
                  <select
                    className="select"
                    name="club"
                    value={details.club}
                    onChange={handleInputChange}
                    required
                    aria-label="Select club"
                  >
                    <option value="" disabled>
                      --Select Club--
                    </option>
                    {clubs.map((club) => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>
                    <Link className="link" href={`/${details.club._id}`}>
                      {details?.club?.name}
                    </Link>
                  </span>
                )}
              </td>
            </tr>
            <tr className="table-row">
              <th className="table-header">Position</th>
              <td className="table-cell">
                {edit ? (
                  <select
                    className="select"
                    name="position"
                    value={details.position}
                    onChange={handleInputChange}
                    required
                    aria-label="Select position"
                  >
                    <option value="" disabled>
                      --Select Position--
                    </option>
                    {positions.map((position) => (
                      <option key={position._id} value={position._id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{details?.position?.name || ""}</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {edit && (
          <div className="form-group-flex mt-6">
            <button
              className="btn btn-gray"
              onClick={() => setEdit(false)}
              disabled={isLoading}
              aria-label="Cancel edit"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={updatePlayer}
              disabled={isLoading}
              aria-label="Save player data"
            >
              {isLoading ? "Saving..." : "Save Data"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
