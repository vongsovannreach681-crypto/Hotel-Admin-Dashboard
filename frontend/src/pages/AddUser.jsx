import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const getInitialForm = (user) => ({
  userId: user?.userId ?? "",
  userName: user?.userName ?? "",
  email: user?.email ?? "",
  password: "",
  booking_id: user?.booking_id ?? "",
  isActive:
    user?.isActive === undefined ? "true" : user.isActive ? "true" : "false",
  avatar: null,
});

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedUser = location.state?.user ?? null;
  const isEditMode = Boolean(selectedUser?._id);

  const [form, setForm] = useState(() => getInitialForm(selectedUser));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "avatar" ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();

      payload.append("userId", form.userId);
      payload.append("userName", form.userName);
      payload.append("email", form.email);
      payload.append("isActive", form.isActive === "true");
      payload.append("booking_id", form.booking_id);

      if (!isEditMode || form.password) {
        payload.append("password", form.password);
      }

      if (form.avatar) {
        payload.append("avatar", form.avatar);
      }

      if (isEditMode) {
        await api.put(`/users/${selectedUser._id}`, payload);
      } else {
        await api.post("/users", payload);
      }

      navigate("/users");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "add"} user`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="rounded-md border border-slate-200 bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to User
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-800 poppins">
              User ID
            </span>
            <input
              type="number"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Enter user ID"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              User Name
            </span>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="User name"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="user@example.com"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Password
            </span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
            />
          </label>

         

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Active
            </span>
            <select
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-green-900 poppins">
              Avatar
            </span>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-6 text-sm text-slate-500 outline-none transition-all duration-200 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--bg-primary)] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition-transform file:hover:scale-105 hover:border-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/5"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(getInitialForm(selectedUser))}
            className="rounded-md bg-[var(--bg-primary)]/80 px-5 py-3 text-md font-semibold text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[var(--bg-primary)] px-5 py-3 text-md font-semibold text-white"
          >
            {saving ? "Saving..." : isEditMode ? "Update User" : "Save User"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddUser;
