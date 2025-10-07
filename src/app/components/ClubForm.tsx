import React, {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
import { ClubInterface } from "../types";

const ClubForm = ({
  clubs,
  setClubs,
  clubSearchTerm,
  handleClubSearch,
  setClubSearchTerm,
}: {
  clubs: ClubInterface[];
  setClubs: (clubs: ClubInterface[]) => void;
  clubSearchTerm: string;
  handleClubSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  setClubSearchTerm: (term: string) => void;
}) => {
  const [clubData, setClubData] = useState({
    name: "",
    country: "",
    level: "",
  });
  const [filteredClubs, setFilteredClubs] = useState<ClubInterface[]>(clubs);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getClubs = useCallback(async () => {
    try {
      const response = await fetch("/api/club");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to fetch clubs");
      }
      const data = await response.json();
      setClubs(data);
      setFilteredClubs(data);
    } catch (error) {
      showErrorMsg("Failed to fetch clubs");
    }
  }, [setClubs]);

  const addClubData = async () => {
    if (!clubData.name || !clubData.country || !clubData.level) {
      showErrorMsg("All fields are required");
      return;
    }
    try {
      const response = await fetch("/api/club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clubData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to add club");
      }
      const data = await response.json();
      showSuccessMsg(data.success || "Club added successfully");
      setClubData({ name: "", country: "", level: "" });
      setClubSearchTerm("");
      setIsDropdownOpen(false);
      await getClubs();
    } catch (error) {
      showErrorMsg("An unexpected error occurred");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isDropdownOpen) return;
    setClubSearchTerm("");
    setFilteredClubs(clubs);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setClubSearchTerm("");
        setFilteredClubs(clubs);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clubs, setClubSearchTerm]);

  return (
    <div className="form-card">
      <h2 className="subtitle">CLUBS</h2>
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="dropdown-toggle" onClick={toggleDropdown}>
          {clubSearchTerm && filteredClubs.length === 0
            ? "No clubs found"
            : "--View registered clubs--"}
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <input
              className="input dropdown-search"
              type="text"
              placeholder="Search clubs..."
              value={clubSearchTerm}
              onChange={handleClubSearch}
              autoFocus
            />
            <div className="dropdown-options">
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => (
                  <div key={club._id} className="dropdown-option">
                    {club.name}
                  </div>
                ))
              ) : (
                <div className="dropdown-option disabled">No clubs found</div>
              )}
            </div>
          </div>
        )}
      </div>
      <h2 className="subtitle text-center">CREATE NEW CLUB</h2>
      <div className="grid gap-4">
        <input
          className="input"
          type="text"
          placeholder="Club Name"
          value={clubData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setClubData({ ...clubData, name: e.target.value })
          }
        />
        <input
          className="input"
          type="text"
          placeholder="Country"
          value={clubData.country}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setClubData({ ...clubData, country: e.target.value })
          }
        />
        <input
          className="input"
          type="text"
          placeholder="Level/Category"
          value={clubData.level}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setClubData({ ...clubData, level: e.target.value })
          }
        />
        <button onClick={addClubData} className="btn btn-blue">
          Save Club
        </button>
      </div>
    </div>
  );
};

export default ClubForm;
// import React, {
//   ChangeEvent,
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
// } from "react";
// import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
// import { ClubInterface } from "../types";

// const ClubForm = ({
//   clubs,
//   setClubs,
//   clubSearchTerm,
//   handleClubSearch,
//   setClubSearchTerm,
// }) => {
//   const [clubData, setClubData] = useState({
//     name: "",
//     country: "",
//     level: "",
//   });
//   const [filteredClubs, setFilteredClubs] = useState<ClubInterface[]>(clubs);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const getClubs = useCallback(async () => {
//     try {
//       const response = await fetch("/api/club");
//       const data = await response.json();
//       if (response.ok) {
//         setClubs(data);
//         setFilteredClubs(data);
//       } else {
//         showErrorMsg(data.msg);
//       }
//     } catch (error) {
//       showErrorMsg("Failed to fetch clubs");
//     }
//   }, [setClubs]);

//   const addClubData = async () => {
//     try {
//       const response = await fetch("/api/club", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(clubData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         showSuccessMsg(data.success || "Club added successfully");
//         setClubData({ name: "", country: "", level: "" });
//         setClubSearchTerm("");
//         setIsDropdownOpen(false);
//         await getClubs();
//       } else {
//         showErrorMsg(data.msg || "Failed to add club");
//       }
//     } catch (error) {
//       showErrorMsg("An unexpected error occurred");
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     if (!isDropdownOpen) {
//       setClubSearchTerm("");
//       setFilteredClubs(clubs);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//         setClubSearchTerm("");
//         setFilteredClubs(clubs);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [clubs]);
//   return (
//     <div className="form-card">
//       <h2 className="subtitle">CLUBS</h2>
//       <div className="custom-dropdown" ref={dropdownRef}>
//         <div className="dropdown-toggle" onClick={toggleDropdown}>
//           {clubSearchTerm.length > 0 && filteredClubs.length === 0
//             ? "No clubs found"
//             : "--View registered clubs--"}
//         </div>
//         {isDropdownOpen && (
//           <div className="dropdown-menu">
//             <input
//               className="input dropdown-search"
//               type="text"
//               placeholder="Search clubs..."
//               value={clubSearchTerm}
//               onChange={handleClubSearch}
//               autoFocus
//             />
//             <div className="dropdown-options">
//               {filteredClubs.length > 0 ? (
//                 filteredClubs.map((club) => (
//                   <div key={club._id} className="dropdown-option">
//                     {club.name}
//                   </div>
//                 ))
//               ) : (
//                 <div className="dropdown-option disabled">No clubs found</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <h2 className="subtitle text-center">CREATE NEW CLUB</h2>
//       <div className="grid-gap-4">
//         <input
//           className="input"
//           type="text"
//           placeholder="Club Name"
//           value={clubData.name}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setClubData({ ...clubData, name: e.target.value })
//           }
//         />
//         <input
//           className="input"
//           type="text"
//           placeholder="Country"
//           value={clubData.country}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setClubData({ ...clubData, country: e.target.value })
//           }
//         />
//         <input
//           className="input"
//           type="text"
//           placeholder="Level/Category"
//           value={clubData.level}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setClubData({ ...clubData, level: e.target.value })
//           }
//         />
//         <button onClick={addClubData} className="btn btn-blue">
//           Save Club
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClubForm;
