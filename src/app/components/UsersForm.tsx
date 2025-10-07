import React, { ChangeEvent, useState } from "react";
import { useAuth } from "../_utils/AuthProvider";
import { UserInterface } from "../types";
import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";

const UsersForm = ({ users, getUsers, setUsers, editId, setEditId }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Partial<UserInterface>>({
    role: "",
    firstname: "", // Adjusted assuming separate fields
    lastname: "",
    phone: "",
    email: "",
    username: "",
  });

  const editUser = async (_id: string) => {
    try {
      const response = await fetch(`/api/user/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to update user");
      }
      const data = await response.json();
      showSuccessMsg(data.success || "User updated");
      setEditId(null);
      await getUsers();
    } catch (error) {
      showErrorMsg("Failed to update user");
    }
  };

  const deleteUser = async (_id: string) => {
    try {
      const response = await fetch(`/api/user/${_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Failed to delete user");
      }
      const data = await response.json();
      showSuccessMsg(data.success || "User deleted");
      await getUsers();
    } catch (error) {
      showErrorMsg("Failed to delete user");
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="subtitle">Users</h2>
      </div>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th>#</th>
                <th>Role</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user1, index) => (
                <tr key={user1._id} className="table-row">
                  <td>{index + 1}</td>
                  {editId === user1._id ? (
                    <>
                      <td>
                        <input
                          className="input"
                          value={userData.role || user1.role}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setUserData({
                              ...userData,
                              role: e.target.value,
                            })
                          }
                          aria-label="Edit role"
                        />
                      </td>
                      <td>
                        <div className="form-group-flex">
                          <input
                            className="input"
                            value={userData.firstname || user1.firstname}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setUserData({
                                ...userData,
                                firstname: e.target.value,
                              })
                            }
                            placeholder="First Name"
                          />
                          <input
                            className="input"
                            value={userData.lastname || user1.lastname}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setUserData({
                                ...userData,
                                lastname: e.target.value,
                              })
                            }
                            placeholder="Last Name"
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => editUser(user1._id)}
                          className="btn btn-green mr-2"
                          aria-label="Save changes"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="btn btn-gray"
                          aria-label="Cancel edit"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user1.role}</td>
                      <td>{`${user1.lastname || ""} ${
                        user1.firstname || ""
                      }`}</td>
                      <td>
                        {user?.role === "admin" && (
                          <button
                            onClick={() => {
                              setEditId(user1._id);
                              setUserData(user1); // Pre-fill form
                            }}
                            className="btn btn-blue mr-2"
                            aria-label="Edit user"
                          >
                            Edit
                          </button>
                        )}
                        {user?._id !== user1._id && (
                          <button
                            onClick={() => deleteUser(user1._id)}
                            className="btn btn-red"
                            aria-label="Delete user"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersForm;
// import React, { ChangeEvent, useState } from "react";
// import { useAuth } from "../_utils/AuthProvider";
// import { UserInterface } from "../types";
// import { showErrorMsg, showSuccessMsg } from "../_utils/Alert";

// const UsersForm = ({ users, getUsers, setUsers, editId, setEditId }) => {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState<Partial<UserInterface>>({
//     role: "",
//     name: "",
//     phone: "",
//     email: "",
//     username: "",
//   });

//   const editUser = async (_id: string) => {
//     try {
//       console.log(userData);
//       const response = await fetch(`/api/user/${_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//         credentials: "include",
//       });
//       const data = await response.json();
//       if (data.msg) {
//         showErrorMsg(data.msg);
//       } else {
//         showSuccessMsg(data.success);
//         setEditId(null);
//         await getUsers();
//       }
//     } catch (error) {
//       showErrorMsg("Failed to update user");
//     }
//   };

//   const deleteUser = async (_id: string) => {
//     try {
//       const response = await fetch(`/api/user/${_id}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });
//       const data = await response.json();
//       if (data.msg) {
//         showErrorMsg(data.msg);
//       } else {
//         showSuccessMsg(data.success);
//         await getUsers();
//       }
//     } catch (error) {
//       showErrorMsg("Failed to delete user");
//     }
//   };

//   return (
//     <div>
//       <div className="card">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="subtitle">Users</h2>
//         </div>
//         {users.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="table">
//               <thead className="thead">
//                 <tr>
//                   <th>#</th>
//                   <th>Role</th>
//                   <th>Name</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users?.map((user1, index) => (
//                   <tr key={user1._id} className="table-row">
//                     <td>{index + 1}</td>
//                     {editId === user1._id ? (
//                       <>
//                         <td>
//                           <input
//                             className="input"
//                             value={user1.role}
//                             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                               setUserData({
//                                 ...userData,
//                                 role: e.target.value,
//                               })
//                             }
//                           />
//                         </td>
//                         <td>
//                           <div className="form-group-flex">
//                             <input
//                               className="input"
//                               value={user1.name}
//                               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                                 setUserData({
//                                   ...userData,
//                                   name: e.target.value,
//                                 })
//                               }
//                               placeholder="Name"
//                             />
//                           </div>
//                         </td>
//                         <td>
//                           <button
//                             onClick={() => editUser(user1._id)}
//                             className="btn btn-green mr-2"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={() => setEditId(null)}
//                             className="btn btn-gray"
//                           >
//                             Cancel
//                           </button>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>{user1.role}</td>
//                         <td>{`${user1.lastname} ${user1.firstname}`}</td>
//                         <td>
//                           {user?.role === "admin" && (
//                             <button
//                               onClick={() => setEditId(user1._id)}
//                               className="btn btn-blue mr-2"
//                             >
//                               Edit
//                             </button>
//                           )}{" "}
//                           {user?._id !== user1._id && (
//                             <button
//                               onClick={() => deleteUser(user1._id)}
//                               className="btn btn-red"
//                             >
//                               Delete
//                             </button>
//                           )}
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UsersForm;
