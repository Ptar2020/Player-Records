import React, { ChangeEvent, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
import { ClubInterface, PositionInterface } from "../types";

const PlayerForm = () =>
  //   {
  //   clubs,
  //   setClubs,
  //   positions,
  //   setPositions,
  // }: {
  //   clubs: ClubInterface[];
  //   setClubs: (clubs: ClubInterface[]) => void;
  //   positions: PositionInterface[];
  //   setPositions: (positions: PositionInterface[]) => void;
  // }
  {
    const router = useRouter();
    const [clubs, setClubs] = useState<ClubInterface[]>([]);
    const [positions, setPositions] = useState<PositionInterface[]>([]);
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
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.msg || "Failed to fetch clubs");
        }
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        showErrorMsg("Failed to fetch clubs");
      }
    }, [setClubs]);

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
    }, [setPositions]);

    const addPlayer = async () => {
      if (
        !playerData.name ||
        !playerData.age ||
        !playerData.country ||
        !playerData.gender ||
        !playerData.club ||
        !playerData.position
      ) {
        showErrorMsg("All fields are required");
        return;
      }
      try {
        const response = await fetch("/api/player/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(playerData),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.msg || "Failed to add player");
        }
        const data = await response.json();
        showSuccessMsg(data.success || "Player added");
        router.push(`/player/${data.player._id}`);
        setPlayerData({
          name: "",
          country: "",
          age: "",
          gender: "",
          club: "",
          position: "",
        });
      } catch (error) {
        showErrorMsg("An unexpected error occurred");
      }
    };

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setPlayerData((prev) => ({
        ...prev,
        [name]: name === "age" ? value : value,
      }));
    };

    useEffect(() => {
      getClubs();
      getPositions();
    }, []);

    return (
      <div className="form-card">
        <h2 className="subtitle">Add Player</h2>
        <div className="grid gap-3">
          <input
            className="input"
            type="text"
            placeholder="Name"
            name="name"
            value={playerData.name}
            onChange={handleChange}
          />
          <div className="form-group-flex">
            <input
              className="input"
              type="number"
              placeholder="Age"
              name="age"
              value={playerData.age}
              onChange={handleChange}
              min="1"
            />
            <input
              className="input"
              type="text"
              placeholder="Country"
              name="country"
              value={playerData.country}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-flex">
            <select
              className="select"
              name="gender"
              value={playerData.gender}
              onChange={handleChange}
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
              name="club"
              value={playerData.club}
              onChange={handleChange}
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
              name="position"
              value={playerData.position}
              onChange={handleChange}
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
// import React, { ChangeEvent, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
// import { ClubInterface, PositionInterface } from "../types";

// const PlayerForm = ({ clubs, setClubs, positions, setPositions }) => {
//   const router = useRouter();
//   const [playerData, setPlayerData] = useState({
//     name: "",
//     country: "",
//     age: "",
//     gender: "",
//     club: "",
//     position: "",
//   });

//   const getClubs = useCallback(async () => {
//     try {
//       const response = await fetch("/api/club");
//       const data = await response.json();
//       if (response.ok) {
//         setClubs(data);
//       } else {
//         showErrorMsg(data.msg);
//       }
//     } catch (error) {
//       showErrorMsg("Failed to fetch clubs");
//     }
//   }, [setClubs]);

//   const getPositions = useCallback(async () => {
//     try {
//       const response = await fetch("/api/position");
//       const data = await response.json();
//       if (response.ok) {
//         setPositions(data);
//       } else {
//         showErrorMsg(data.msg);
//       }
//     } catch (error) {
//       showErrorMsg("Failed to fetch positions");
//     }
//   }, [setPositions]);

//   const addPlayer = async () => {
//     console.log(playerData);
//     try {
//       const response = await fetch("/api/player/new", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(playerData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         router.push(`/player/${data.player._id}`);
//         showSuccessMsg(data.success);
//         setPlayerData({
//           name: "",
//           country: "",
//           age: "",
//           gender: "",
//           club: "",
//           position: "",
//         });
//       } else {
//         showErrorMsg(data.msg || "Failed to add player");
//       }
//     } catch (error) {
//       showErrorMsg("An unexpected error occurred");
//     }
//   };

//   return (
//     <div className="form-card">
//       <h2 className="subtitle">Add Player</h2>
//       <div className="grid-gap-3">
//         <input
//           className="input"
//           type="text"
//           placeholder="Name"
//           value={playerData.name}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setPlayerData({ ...playerData, name: e.target.value })
//           }
//         />
//         <div className="form-group-flex">
//           <input
//             className="input"
//             type="number"
//             placeholder="Age"
//             value={playerData.age}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setPlayerData({ ...playerData, age: e.target.value })
//             }
//           />
//           <input
//             className="input"
//             type="text"
//             placeholder="Country"
//             value={playerData.country}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setPlayerData({ ...playerData, country: e.target.value })
//             }
//           />
//         </div>
//         <div className="form-group-flex">
//           <select
//             className="select"
//             value={playerData.gender}
//             onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//               setPlayerData({ ...playerData, gender: e.target.value })
//             }
//           >
//             <option value="" disabled>
//               Select Gender
//             </option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           <select
//             className="select"
//             value={playerData.club}
//             onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//               setPlayerData({ ...playerData, club: e.target.value })
//             }
//           >
//             <option value="" disabled>
//               Select Club
//             </option>
//             {clubs.map((club) => (
//               <option key={club._id} value={club._id}>
//                 {club.name}
//               </option>
//             ))}
//           </select>

//           <select
//             className="select"
//             value={playerData.position}
//             onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//               setPlayerData({ ...playerData, position: e.target.value })
//             }
//           >
//             <option value="" disabled>
//               Select Position
//             </option>
//             {positions.map((position) => (
//               <option key={position._id} value={position._id}>
//                 {position.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button onClick={addPlayer} className="btn btn-green">
//           Save Player
//         </button>
//       </div>
//     </div>
//   );
// };
// export default PlayerForm;
