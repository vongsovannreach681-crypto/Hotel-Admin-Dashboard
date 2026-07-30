import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  return `http://localhost:3000/${avatar.replace(/^\/+/, "")}`;
};

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user ?? null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.user) return;

    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load user details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, location.state?.user]);

  if (loading) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          User Detail
        </h1>
        <p className="mt-4 text-slate-600">Loading user details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          User Detail
        </h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!user) return null;

  const avatarUrl = getAvatarUrl(user.avatar);

  return (
    <section className="rounded-md bg-white px-10 py-10 shadow">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="rounded-full bg-[var(--bg-primary)] p-3 text-white"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          User Detail
        </h1>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.userName || "User"}
              className="h-[320px] w-[320px] rounded-md object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-[320px] w-[320px] items-center justify-center rounded-md bg-slate-100 text-sm text-slate-400">
              No avatar
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 text-slate-700">
          <h2 className="text-3xl font-semibold text-[var(--bg-primary)]">
            {user.userName ?? "-"}
          </h2>
          <p>User ID: {user.userId ?? "-"}</p>
          <p>Email: {user.email ?? "-"}</p>
          <p>Booking ID: {user.booking_id ?? "-"}</p>
          <p>Status: {user.isActive ? "Active" : "Inactive"}</p>
          <p>
            Created:{" "}
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          navigate("/users/add", {
            state: { user: { ...user, _id: id } },
          })
        }
        className="mt-6 rounded-md bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        Edit User
      </button>
    </section>
  );
};

export default UserDetail;
