import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  return `http://localhost:3000/${avatar.replace(/^\/+/, "")}`;
};

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Failed to load users",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        String(user.userId ?? "").toLowerCase().includes(term) ||
        String(user.userName ?? "").toLowerCase().includes(term) ||
        String(user.email ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? user.isActive : !user.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const handleRowClick = (user) => {
    navigate(`/users/${user._id}`);
  };

  const handleEdit = (user) => {
    navigate("/users/add", { state: { user } });
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Delete user "${user.userName || user.userId}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/users/${user._id}`);
      setUsers((current) => current.filter((item) => item._id !== user._id));
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to delete user",
      );
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">User</h1>
        <p className="mt-4 text-slate-600">Loading user data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">User</h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="mb-3 flex flex-wrap items-center gap-3 rounded bg-white p-4 shadow">
        <button
          type="button"
          onClick={() => navigate("/users/add")}
          className="rounded bg-[var(--bg-primary)] poppins px-4 py-2.5 text-md font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add User
        </button>

        <div className="relative flex-1 min-w-[240px]">
          <i className="fa-solid poppins fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full poppins rounded-lg border border-transparent bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer poppins appearance-none rounded-lg border border-transparent bg-slate-50 py-2.5 pl-4 pr-9 text-sm text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
          <span>
            {filteredUsers.length} of {users.length} users
          </span>
          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-[var(--bg-primary)] hover:underline poppins"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="rounded bg-white shadow">
        <div className="overflow-hidden rounded border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y  divide-slate-200">
              <thead className="bg-[var(--bg-primary)] poppins">
                <tr className="text-center text-md font-semibold text-white">
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 poppins bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const avatarUrl = getAvatarUrl(user.avatar);

                    return (
                      <tr
                        key={user._id}
                        onClick={() => handleRowClick(user)}
                        className="cursor-pointer text-center text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={user.userName || "User"}
                                className="h-14 w-14 rounded-full object-cover shadow-sm"
                              />
                            ) : (
                              <span className="text-slate-400">No avatar</span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                          {user.userId ?? "-"}
                        </td>
                        <td className="px-4 py-4">{user.userName ?? "-"}</td>
                        <td className="px-4 py-4">{user.email ?? "-"}</td>
                        <td className="px-4 py-4">{user.booking_id ?? "-"}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(user);
                              }}
                              title="Edit user"
                              className="rounded-lg bg-[var(--bg-primary)]/70 px-4 py-4 text-sm font-medium text-white shadow-sm transition-all duration-150 active:scale-95"
                            >
                              <i className="fa-solid fa-pen text-xs"></i>
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(user);
                              }}
                              title="Delete user"
                              className="rounded-lg bg-[var(--bg-primary)] px-4 py-4 text-sm font-medium text-white shadow-sm transition-all duration-150 active:scale-95"
                            >
                              <i className="fa-solid fa-trash text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No user records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default Users;
