import React, {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
import { PositionInterface } from "../types";

const PositionForm = ({
  positions,
  setPositions,
}: {
  positions: PositionInterface[];
  setPositions: (positions: PositionInterface[]) => void;
}) => {
  const [positionData, setPositionData] = useState({ name: "" });
  const [positionSearchTerm, setPositionSearchTerm] = useState<string>("");
  const [filteredPositions, setFilteredPositions] =
    useState<PositionInterface[]>(positions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPositions = useCallback(async () => {
    try {
      const response = await fetch("/api/position");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to fetch positions");
      }
      const data = await response.json();
      setPositions(data);
      setFilteredPositions(data);
    } catch (error) {
      showErrorMsg("Failed to fetch positions");
    }
  }, [setPositions]);

  const addPosition = async () => {
    if (!positionData.name) {
      showErrorMsg("Position name is required");
      return;
    }
    try {
      const response = await fetch("/api/position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(positionData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to create position");
      }
      const data = await response.json();
      showSuccessMsg(data.success || "Position created");
      setPositionData({ name: "" });
      setPositionSearchTerm("");
      setIsDropdownOpen(false);
      await getPositions();
    } catch (error) {
      showErrorMsg("An unexpected error occurred");
    }
  };

  const handlePositionSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setPositionSearchTerm(searchTerm);
    const filtered = positions.filter((position) =>
      position.name.toLowerCase().includes(searchTerm)
    );
    setFilteredPositions(filtered);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isDropdownOpen) return;
    setPositionSearchTerm("");
    setFilteredPositions(positions);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setPositionSearchTerm("");
        setFilteredPositions(positions);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [positions]);

  return (
    <div className="form-card">
      <h2 className="subtitle">POSITIONS</h2>
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="dropdown-toggle" onClick={toggleDropdown}>
          {positionSearchTerm && filteredPositions.length === 0
            ? "No positions found"
            : "--View available positions--"}
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <input
              className="input dropdown-search"
              type="text"
              placeholder="Search positions..."
              value={positionSearchTerm}
              onChange={handlePositionSearch}
              autoFocus
            />
            <div className="dropdown-options">
              {filteredPositions.length > 0 ? (
                filteredPositions.map((position) => (
                  <div key={position._id} className="dropdown-option">
                    {position.name}
                  </div>
                ))
              ) : (
                <div className="dropdown-option disabled">
                  No positions found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <h2 className="subtitle text-center">CREATE NEW POSITION</h2>
      <div className="grid gap-4">
        <input
          className="input"
          type="text"
          placeholder="Position Name"
          value={positionData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPositionData({ ...positionData, name: e.target.value })
          }
        />
        <button onClick={addPosition} className="btn btn-blue">
          Save Position
        </button>
      </div>
    </div>
  );
};
export default PositionForm;
// import React, {
//   ChangeEvent,
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
// } from "react";
// import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";
// import { PositionInterface } from "../types";

// const PositionForm = ({ positions, setPositions }) => {
//   const [positionData, setPositionData] = useState({ name: "" });
//   const [positionSearchTerm, setPositionSearchTerm] = useState<string>("");
//   const [filteredPositions, setFilteredPositions] =
//     useState<PositionInterface[]>(positions);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const getPositions = useCallback(async () => {
//     try {
//       const response = await fetch("/api/position");
//       const data = await response.json();
//       if (response.ok) {
//         setPositions(data);
//         setFilteredPositions(data);
//       } else {
//         showErrorMsg(data.msg);
//       }
//     } catch (error) {
//       showErrorMsg("Failed to fetch positions");
//     }
//   }, [setPositions]);

//   const addPosition = async () => {
//     try {
//       const response = await fetch("/api/position", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(positionData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         showSuccessMsg(data.success);
//         setPositionData({ name: "" });
//         setPositionSearchTerm("");
//         setIsDropdownOpen(false);
//         await getPositions();
//       } else {
//         showErrorMsg(data.msg || "Failed to create position");
//       }
//     } catch (error) {
//       showErrorMsg("An unexpected error occurred");
//     }
//   };

//   const handlePositionSearch = (e: ChangeEvent<HTMLInputElement>) => {
//     const searchTerm = e.target.value;
//     setPositionSearchTerm(searchTerm);
//     if (searchTerm.trim() === "") {
//       setFilteredPositions(positions);
//     } else {
//       const filtered = positions.filter((position) =>
//         position.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredPositions(filtered);
//     }
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//     if (!isDropdownOpen) {
//       setPositionSearchTerm("");
//       setFilteredPositions(positions);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//         setPositionSearchTerm("");
//         setFilteredPositions(positions);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [positions]);

//   return (
//     <div className="form-card">
//       <h2 className="subtitle">POSITIONS</h2>
//       <div className="custom-dropdown" ref={dropdownRef}>
//         <div className="dropdown-toggle" onClick={toggleDropdown}>
//           {positionSearchTerm.length > 0 && filteredPositions.length === 0
//             ? "No positions found"
//             : "--View available positions--"}
//         </div>
//         {isDropdownOpen && (
//           <div className="dropdown-menu">
//             <input
//               className="input dropdown-search"
//               type="text"
//               placeholder="Search positions..."
//               value={positionSearchTerm}
//               onChange={handlePositionSearch}
//               autoFocus
//             />
//             <div className="dropdown-options">
//               {filteredPositions.length > 0 ? (
//                 filteredPositions.map((position) => (
//                   <div key={position._id} className="dropdown-option">
//                     {position.name}
//                   </div>
//                 ))
//               ) : (
//                 <div className="dropdown-option disabled">
//                   No position found
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <h2 className="subtitle text-center">CREATE NEW POSITION</h2>
//       <div className="grid-gap-4">
//         <input
//           className="input"
//           type="text"
//           placeholder="Position Name"
//           value={positionData.name}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setPositionData({ ...positionData, name: e.target.value })
//           }
//         />
//         <button onClick={addPosition} className="btn btn-blue">
//           Save Position
//         </button>
//       </div>
//     </div>
//   );
// };
// export default PositionForm;
