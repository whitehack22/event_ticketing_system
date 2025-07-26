import { type RootState } from "../../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "../../../../Features/users/usersAPI";
import { useNavigate } from "react-router";
import { logout } from "../../../../Features/login/userSlice";
import UpdateProfile from "./UpdateProfile";
import { FaSignOutAlt, FaUserEdit } from "react-icons/fa";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const userID = user.user?.userID;

  const { data, isLoading, error, refetch } = userAPI.useGetUserByIdQuery(userID ?? 0, {
    skip: !userID,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isLoading ? (
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error loading profile</p>
      ) : (
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            User Profile
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-center border rounded-lg p-6 bg-gray-50">
            <img
              src={
                data?.image_url ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="User Avatar"
              className="w-36 h-36 object-cover rounded-full border-4 border-primary shadow-md"
            />
            <div className="text-gray-700 w-full">
              <h3 className="text-xl font-semibold">
                {data?.firstName} {data?.lastName}
              </h3>
              <p className="mt-2">
                <span className="font-medium">User ID:</span> {data?.userID}
              </p>
              <p>
                <span className="font-medium">Email:</span> {data?.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {data?.contactPhone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {data?.address}
              </p>
              <p>
                <span className="font-medium">Role:</span> {data?.role}
              </p>
              <p>
                <span className="font-medium">Verified:</span>{" "}
                {data?.isVerified ? "Yes ✅" : "No ❌"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <button
              className="btn btn-info w-full sm:w-auto flex items-center gap-2"
              onClick={() => {
                (document.getElementById("update_profile_modal") as HTMLDialogElement)?.showModal();
              }}
            >
              <FaUserEdit /> Update Profile
            </button>

            <button
              className="btn btn-error w-full sm:w-auto flex items-center gap-2"
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {data && <UpdateProfile user={data} refetch={refetch} />}
    </div>
  );
};

export default UserProfile;
