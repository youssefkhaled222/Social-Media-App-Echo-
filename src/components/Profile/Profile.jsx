import React, { useContext, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Loader from '../Loader/Loader'
import PostCard from '../PostCard/PostCard'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const PLACEHOLDER_IMAGE = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function Profile() {
  const { setuserData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [passwords, setPasswords] = useState({
    password: "",
    newPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const imageInput = useRef(null);

  function getProfileData() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  function getMyPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts/feed`, {
      params: {
        only: "me",
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorMessage,
  } = useQuery({
    queryKey: ["profileData"],
    queryFn: getProfileData,
  });

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorMessage,
  } = useQuery({
    queryKey: ["myPosts"],
    queryFn: getMyPosts,
  });

  function uploadPhoto(formData) {
    return axios.put(`https://route-posts.routemisr.com/users/upload-photo`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate: mutatePhoto, isPending: isUploadingPhoto } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: (res) => {
      const updatedUser = res?.data?.data?.user || res?.data?.data || null;
      if (updatedUser) {
        setuserData(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      toast.success("Profile photo updated successfully!", {
        closeOnClick: true,
        autoClose: 2000,
      });
      if (imageInput.current) {
        imageInput.current.value = "";
      }
    },
    onError: () => {
      toast.error("Failed to update profile photo", {
        closeOnClick: true,
        autoClose: 2000,
      });
    },
  });

  function changePassword(data) {
    return axios.patch(`https://route-posts.routemisr.com/users/change-password`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { mutate: mutatePassword } = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      const newToken = res?.data?.data?.token;
      if (newToken) {
        localStorage.setItem("userToken", newToken);
      }
      setPasswords({
        password: "",
        newPassword: "",
      });
      toast.success("Password changed successfully!", {
        closeOnClick: true,
        autoClose: 2000,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to change password", {
        closeOnClick: true,
        autoClose: 2000,
      });
    },
    onSettled: () => {
      setIsChangingPassword(false);
    }
  });

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    mutatePhoto(formData);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();

    if (!passwords.password || !passwords.newPassword) return;

    setIsChangingPassword(true);
    mutatePassword(passwords);
  }

  if (profileLoading || postsLoading) {
    return <Loader />;
  }

  if (profileError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600 shadow-sm">
        {profileErrorMessage.message}
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-600 shadow-sm">
        {postsErrorMessage.message}
      </div>
    );
  }

  const user = profileData?.data?.data?.user || profileData?.data?.data;
  const posts = postsData?.data?.data?.posts || [];

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>

      <section className="space-y-6">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white/80 shadow-2xl ring-1 ring-slate-200 backdrop-blur-sm">
          <div className="h-28 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-4">
                <img
                  src={user?.photo || PLACEHOLDER_IMAGE}
                  alt="profile"
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                />

                <div className="mt-4 sm:mt-0">
                  <h1 className="text-2xl font-black text-slate-800">
                    {user?.name || "User"}
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    @{user?.username || "username"}
                  </p>
                  {user?.email && (
                    <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-3 text-center ring-1 ring-slate-200 sm:mt-0">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Posts
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {posts.length}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <label className="cursor-pointer rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-center font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                {isUploadingPhoto ? "Uploading..." : "Change Profile Picture"}
                <input
                  ref={imageInput}
                  type="file"
                  hidden
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur-sm">
          <h2 className="text-2xl font-extrabold text-slate-800">Change Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Update your password to keep your account secure.
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="mb-4 rounded-3xl bg-white/70 p-5 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-slate-800">My Posts</h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage your posts, edit them, delete them, and keep the conversation going.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="mx-auto max-w-2xl rounded-[2rem] bg-white/80 px-6 py-12 text-center shadow-xl ring-1 ring-slate-200 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-slate-700">No posts yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your posts will appear here once you start sharing.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}