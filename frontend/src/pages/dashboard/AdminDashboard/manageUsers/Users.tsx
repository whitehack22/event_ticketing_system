import { useState } from "react";
import { userAPI, type TUser } from "../../../../Features/users/usersAPI";
import ChangeRole from "./ChangeRole";

const Users = () => {
    const { data: usersData, isLoading, error } = userAPI.useGetUsersQuery(
        undefined, // No parameters needed for this query
        {
            refetchOnMountOrArgChange: true, // Refetch data when component mounts or arguments change
            pollingInterval: 60000, // Poll every 60 seconds to keep data fresh
        }
    );

    // State for the user to update role
    const [selectedUser, setSelectedUser] = useState<TUser | null>(null);

    // console.log("Loading:", isLoading);
    // console.log("Error:", error);
    // console.log("Users data:", usersData);

    return (
        <div>

            {/* Change Role Modal */}
            <ChangeRole user={selectedUser} />

            {/* Display Users */}
            {isLoading && <p>Loading users...</p>}
            {error && <p className="text-red-500">Error fetching users</p>}
            {usersData && usersData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-700 text-white">
                            <tr>

                                <th>User ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Verification Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user: TUser) => (
                                <tr key={user.userID} className="hover:bg-gray-100">

                                    <td>{user.userID}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.contactPhone}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span className={`badge ${user.isVerified ? "badge-success" : "badge-warning"}`}>
                                            {user.isVerified ? (
                                                <span className="text-green-700 lg:text-base">Verified</span>
                                            ) : (
                                                <span className="text-yellow-700 lg:text-base">Not Verified</span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="btn btn-sm btn-primary text-blue-500"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                (document.getElementById('role_modal') as HTMLDialogElement)?.showModal();
                                            }}
                                        >
                                            Change Role
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default Users;