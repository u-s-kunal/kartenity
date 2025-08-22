"use client";

import { useEffect, useState } from "react";
import { ToastContainer ,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/78a733475d8417d3ed2fc8ee`,
          {
            method: "GET",
            credentials: "include", // in case you’re using cookies for auth
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "Something went wrong");
      } finally {
          setLoading(false);
      }
    };

    fetchUser();
  }, []);

  async function handleSave() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update user");

      const updated = await res.json();
      setUser(updated);
      setEditMode(false);
          toast.success("Profile updated successfully 🎉");
        
    } catch (err) {
      console.error("Error updating profile:", err);
 toast.error("Error updating profile ❌");
    }
  }

  async function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("profilePic", file);

    setUploading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}/profilePic`,
        {
          method: "PUT",
          body: form,
        }
      );

      if (!res.ok) throw new Error("Failed to upload profile picture");

      const updated = await res.json();
      setUser(updated);
      setFormData(updated);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
        toast.error("Error uploading profile picture ❌");
    } finally {
        setUploading(false);
        toast.success("Profile Picture updated successfully 🎉");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-r from-gray-700 to-cyan-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-r from-gray-700  to-cyan-600">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
      <div className="min-h-[92vh] flex items-center justify-center bg-gradient-to-r from-gray-700  to-cyan-600 p-4">
        <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-lg text-white">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              user.profilePic
                ? `${process.env.NEXT_PUBLIC_API_URL}${user.profilePic}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500 shadow-md"
          />

          {editMode && (
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="text-sm text-gray-300"
              />
              {uploading && (
                <p className="text-xs text-yellow-400 mt-1">
                  Uploading profile picture...
                </p>
              )}
            </div>
          )}

          {editMode ? (
            <input
              className="bg-gray-700 p-2 rounded-md mt-3 text-center"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          ) : (
            <h2 className="text-2xl font-bold mt-3">{user.username}</h2>
          )}
          <p className="text-gray-400 text-sm">User ID: {user._id}</p>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          {/* Email */}
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {editMode ? (
              <input
                className="bg-gray-700 p-2 rounded-md w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            ) : (
              user.email
            )}
          </p>

          {/* Mobile */}
          <p>
            <span className="font-semibold">Mobile:</span>{" "}
            {editMode ? (
              <input
                className="bg-gray-700 p-2 rounded-md w-full"
                value={formData.mobile || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            ) : (
              user.mobile || "N/A"
            )}
          </p>

          {/* Password (hidden but editable) */}
          <p>
            <span className="font-semibold">Password:</span>{" "}
            {editMode ? (
              <input
                type="password"
                className="bg-gray-700 p-2 rounded-md w-full"
                placeholder="Enter new password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            ) : (
              "********"
            )}
          </p>

          {/* Default Address */}
          <div>
            <p className="font-semibold mb-1">Default Address:</p>
            {editMode ? (
              <textarea
                className="bg-gray-700 p-2 rounded-md w-full"
                value={formData.defaultAddress || ""}
                onChange={(e) =>
                  setFormData({ ...formData, defaultAddress: e.target.value })
                }
              />
            ) : (
              <p className="bg-gray-700 p-2 rounded-md text-sm">
                {user.defaultAddress || "No default address set"}
              </p>
            )}
          </div>

          {/* Other Addresses */}
          {editMode ? (
            <div>
              <p className="font-semibold mb-1">Other Addresses:</p>
              <textarea
                className="bg-gray-700 p-2 rounded-md w-full"
                value={(formData.addresses || []).join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    addresses: e.target.value.split("\n"),
                  })
                }
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter one address per line
              </p>
            </div>
          ) : (
            user.addresses &&
            user.addresses.length > 0 && (
              <div>
                <p className="font-semibold mb-1">Other Addresses:</p>
                <ul className="space-y-2">
                  {user.addresses.map((addr, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-700 p-2 rounded-md text-sm"
                    >
                      {addr}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 px-4 py-2 rounded text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setFormData(user);
                  setEditMode(false);
                }}
                className="bg-gray-600 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 px-4 py-2 rounded text-white"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
