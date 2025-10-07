// page.jsx (Home)
"use client";

import { useEffect, useState, useCallback } from "react";
import { PlayerInterface } from "./types";
import Link from "next/link";
import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
import debounce from "lodash/debounce";
import { useAuth } from "./_utils/AuthProvider";
import swal from "sweetalert";

export default function Home() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<PlayerInterface[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getPlayers = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/player`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      const data = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      setError("Failed to fetch players");
      showErrorMsg("Failed to fetch players");
    }
  }, []);

  const deletePlayer = useCallback(
    async (_id: string, name: string) => {
      const confirmed = await swal({
        title: `Sure to delete ${name} records`,
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      });

      if (confirmed) {
        try {
          const response = await fetch(`/api/player/${_id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const data = await response.json();

          if (!response.ok) {
            showErrorMsg(data.msg || "Failed to delete player");
            return;
          }
          showSuccessMsg(`${name} deleted successfully`);
          await getPlayers();
        } catch (error) {
          showErrorMsg("Failed to delete player");
          setError("Failed to delete player");
        }
      }
    },
    [getPlayers]
  );

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((value: string) => {
      const filtered = players.filter((player) =>
        player.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }, 300),
    [players]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };
  useEffect(() => {
    getPlayers();
    return () => {
      handleSearch.cancel(); // Clean up debounce on unmount
    };
  }, [getPlayers]);

  if (error) {
    return (
      <div className="error-text" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container max-w-4xl">
      <h1 className="title">PLAYER RECORDS</h1>

      <div className="mb-6">
        <input
          className="input"
          type="text"
          placeholder="Search by player name"
          value={searchTerm}
          onChange={handleInputChange}
          aria-label="Search players by name"
        />
      </div>

      {filteredPlayers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="table-header">#</th>
                <th className="table-header">Name</th>
                <th className="table-header">Age</th>
                <th className="table-header">Position</th>{" "}
                <th className="table-header">Club</th>
                <th className="table-header">Country</th>
                {user?.role === "admin" && (
                  <th className="table-header">Action</th>
                )}{" "}
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
                    <Link className="link" href={`/${player.club.name}`}>
                      {player.club?.name}
                    </Link>
                  </td>
                  <td className="table-cell">{player.country} </td>
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
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { PlayerInterface } from "./types";
// import Link from "next/link";
// import { showErrorMsg, showSuccessMsg } from "@/app/_utils/Alert";
// import debounce from "lodash/debounce";
// import { useAuth } from "./_utils/AuthProvider";
// import swal from "sweetalert";

// export default function Home() {
//   const { user } = useAuth();
//   const [players, setPlayers] = useState<PlayerInterface[]>([]);
//   const [filteredPlayers, setFilteredPlayers] = useState<PlayerInterface[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const getPlayers = useCallback(async () => {
//     try {
//       // setIsLoading(true);
//       setError(null);
//       const response = await fetch(`/api/player`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch players");
//       }
//       const data = await response.json();
//       setPlayers(data);
//       setFilteredPlayers(data);
//     } catch (error) {
//       setError("Failed to fetch players");
//       showErrorMsg("Failed to fetch players");
//     }
//     // finally {
//     //   setIsLoading(false);
//     // }
//   }, []);

//   const deletePlayer = useCallback(
//     async (_id: string, name: string) => {
//       const confirmed = await swal({
//         title: `Sure to delete ${name} records`,
//         icon: "warning",
//         buttons: ["Cancel", "Delete"],
//         dangerMode: true,
//       });

//       if (confirmed) {
//         try {
//           // console.log(players);
//           // const newPlayers = players.filter((player) => player._id !== _id);
//           // setFilteredPlayers(newPlayers);
//           // console.log(newPlayers);
//           // setIsLoading(true);
//           const response = await fetch(`/api/player/${_id}`, {
//             method: "DELETE",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//           });
//           const data = await response.json();

//           if (!response.ok) {
//             showErrorMsg(data.msg || "Failed to delete player");
//             return;
//           }
//           showSuccessMsg(`${name} deleted successfully`);
//           // showSuccessMsg(data.success || `${name} deleted successfully`);
//           // const newPlayers = players.filter((player) => player._id !== _id);
//           // setFilteredPlayers(newPlayers);
//           await getPlayers();
//         } catch (error) {
//           showErrorMsg("Failed to delete player");
//           setError("Failed to delete player");
//         } // finally {
//         //   setIsLoading(false);
//         // }
//       }
//     },
//     [getPlayers]
//   );

//   // Debounced search handler
//   const handleSearch = useCallback(
//     debounce((value: string) => {
//       const filtered = players.filter((player) =>
//         player.name.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredPlayers(filtered);
//     }, 300),
//     [players]
//   );

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     handleSearch(e.target.value);
//   };
//   useEffect(() => {
//     getPlayers();
//     return () => {
//       handleSearch.cancel(); // Clean up debounce on unmount
//     };
//   }, [getPlayers]);

//   if (error) {
//     return (
//       <div className="text-red-500 text-center mt-4" role="alert">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <h1 className="text-2xl font-bold mb-6 text-center">PLAYER RECORDS</h1>

//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search by player name"
//           value={searchTerm}
//           onChange={handleInputChange}
//           className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           aria-label="Search players by name"
//         />
//       </div>

//       {filteredPlayers.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse bg-white shadow-md rounded-lg">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-3 text-left font-semibold text-gray-700">#</th>
//                 <th className="p-3 text-left font-semibold text-gray-700">
//                   Name
//                 </th>
//                 <th className="p-3 text-left font-semibold text-gray-700">
//                   Age
//                 </th>
//                 <th className="p-3 text-left font-semibold text-gray-700">
//                   Country
//                 </th>
//                 <th className="p-3 text-left font-semibold text-gray-700">
//                   Gender
//                 </th>
//                 <th className="p-3 text-left font-semibold text-gray-700">
//                   Club
//                 </th>
//                 <th className="p-3 text-left font-semibold text-gray-700">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPlayers.map((player: PlayerInterface, index) => (
//                 <tr key={player._id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{index + 1}</td>
//                   <td className="p-3">
//                     <Link
//                       href={`/player/${player._id}`}
//                       className="text-blue-500 hover:underline"
//                     >
//                       {player.name || "N/A"}
//                     </Link>
//                   </td>
//                   <td className="p-3">{player.age}</td>
//                   <td className="p-3">{player.country}</td>
//                   <td className="p-3">{player.gender}</td>
//                   <td className="p-3">{player.club?.name} </td>
//                   <td className="p-3">
//                     <button
//                       onClick={() => deletePlayer(player._id, player.name)}
//                       className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
//                       aria-label={`Delete player ${player.name}`}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-center text-gray-500" aria-live="polite">
//           No players found
//         </p>
//       )}
//     </div>
//   );
// }
