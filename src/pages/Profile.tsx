/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Banner2 from "../components/Banner2";
import { Button } from "../components/Button";
import { useAppDispatch, useAppSelector } from "../hooks";
import imageCompression from "browser-image-compression";
import { getSingleUser, updateUser } from "../core/auth/userSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const auth = useAppSelector((state) => state.auth.user);

  const user = users.user;

  const [profile, setProfile] = useState({
    firstName: user?.firstName ? user?.firstName : "",
    lastName: user?.lastName ? user?.lastName : "",
    email: user?.email ? user?.email : "",
    phone: user?.email ? user?.phoneNumber : "",
    address: user?.address ? user?.address : "",
    city: user?.city ? user?.city : "",
    state: user?.state ? user?.state : "",
    zip: user?.zip ? user?.zip : "",
  });
  const [avatarFile, setAvatarFile] = useState<string>(
    user?.avatar ? user?.avatar : "",
  );

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 400,
    });

    const reader = new FileReader();
    reader.readAsDataURL(compressed);

    reader.onloadend = () => {
      const image = reader.result as string;

      setAvatarFile(image);
    };
  };

  const handleProfileChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.email,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      zip: profile.zip,
      avatar: avatarFile,
    };

    dispatch(updateUser({ id: user?.userId, userData: payload }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        dispatch(getSingleUser(user?.userId));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    setProfile({
      firstName: user?.firstName ? user?.firstName : "",
      lastName: user?.lastName ? user?.lastName : "",
      email: user?.email ? user?.email : "",
      phone: user?.phoneNumber ? user?.phoneNumber : "",
      address: user?.address ? user?.address : "",
      city: user?.city ? user?.city : "",
      state: user?.state ? user?.state : "",
      zip: user?.zip ? user?.zip : "",
    });
    setAvatarFile(user?.avatar ? user?.avatar : "");
  }, [
    auth.userId,
    dispatch,
    user?.address,
    user?.avatar,
    user?.city,
    user?.email,
    user?.firstName,
    user?.lastName,
    user?.phoneNumber,
    user?.state,
    user?.zip,
  ]);

  return (
    <div className="pt-20">
      <Banner2
        title="Profile"
        subTitle="Manage your driver details"
        description="Keep your information current so bookings, receipts, and updates
          arrive exactly where you need them."
      />

      <section className="py-16">
        <div className="parent">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-2">Profile photo</h2>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-6">
                Upload a recent photo so rental agents can verify your pickup.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="size-28 rounded-full border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {avatarFile ? (
                    <img
                      src={avatarFile}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-blue-500 font-semibold">
                      {user?.firstName && user?.firstName.slice(0, 1)}
                      {user?.lastName && user?.lastName.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-600 dark:text-gray-200 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                    onChange={handleUpload}
                  />
                  <div className="rounded-xl bg-blue-50 dark:bg-gray-600 p-4 text-sm text-gray-700 dark:text-gray-100">
                    We support JPG, PNG, or WEBP. Max size 5MB.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-2">Account details</h2>
              <p className="text-sm text-gray-600 dark:text-gray-200 mb-6">
                Update your personal information and home address.
              </p>
              {users.loading ? (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md text-center">
                  <div className="mx-auto flex items-center justify-center">
                    <Loader></Loader>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-100 mb-2">
                    Loading...
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        First name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.firstName}
                        onChange={(event) =>
                          handleProfileChange("firstName", event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.lastName}
                        onChange={(event) =>
                          handleProfileChange("lastName", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.email}
                        disabled
                        onChange={(event) =>
                          handleProfileChange("email", event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.phone}
                        onChange={(event) =>
                          handleProfileChange("phone", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Home address
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={profile.address}
                      onChange={(event) =>
                        handleProfileChange("address", event.target.value)
                      }
                      placeholder="74 MKO Abiola Road"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.city}
                        onChange={(event) =>
                          handleProfileChange("city", event.target.value)
                        }
                        placeholder="Ikeja"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.state}
                        onChange={(event) =>
                          handleProfileChange("state", event.target.value)
                        }
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                        ZIP code
                      </label>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-100 dark:bg-gray-400 dark:text-white dark:placeholder:text-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={profile.zip}
                        onChange={(event) =>
                          handleProfileChange("zip", event.target.value)
                        }
                        placeholder="112233"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-full px-8 py-3"
                    >
                      {users.loading ? (
                        <span className="flex items-center justify-center gap-1">
                          <Loader />
                          Loading...
                        </span>
                      ) : (
                        <span>Save changes</span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
