import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const getInitialForm = (staff) => ({
  staff_id: staff?.staff_id ?? "",
  hotel_id: staff?.hotel_id ?? "",
  full_name: staff?.full_name ?? "",
  position: staff?.position ?? "manager",
  email: staff?.contact?.email ?? "",
  phone: staff?.contact?.phone ?? "",
  salary: staff?.salary ?? "",
  date_of_birth: staff?.date_of_birth ? String(staff.date_of_birth).slice(0, 10) : "",
  isActive:
    staff?.isActive === undefined ? "true" : staff.isActive ? "true" : "false",
});

const AddStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedStaff = location.state?.staff ?? null;
  const isEditMode = Boolean(selectedStaff?._id);

  const [form, setForm] = useState(() => getInitialForm(selectedStaff));
  const [hotels, setHotels] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/hotel");
        setHotels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load hotels",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        staff_id: form.staff_id,
        hotel_id: form.hotel_id,
        full_name: form.full_name,
        position: form.position,
        contact: JSON.stringify({
          email: form.email,
          phone: form.phone,
        }),
        salary: form.salary,
        date_of_birth: form.date_of_birth,
        isActive: form.isActive === "true",
      };

      if (isEditMode) {
        await api.put(`/staff/${selectedStaff._id}`, payload);
      } else {
        await api.post("/staff", payload);
      }

      navigate("/staff");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "add"} staff`,
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Staff</h1>
        <p className="mt-4 text-slate-600">Loading staff form...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/staff")}
          className="rounded-md border border-slate-200 bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Staff
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
              Staff ID
            </span>
            <input
              type="number"
              name="staff_id"
              value={form.staff_id}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Enter staff ID"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Hotel
            </span>
            <select
              name="hotel_id"
              value={form.hotel_id}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="">Select hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel.hotel_id}>
                  {hotel.hotel_name} ({hotel.hotel_id})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Full Name
            </span>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Staff name"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Position
            </span>
            <select
              name="position"
              value={form.position}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
              <option value="cleaner">Cleaner</option>
              <option value="counter">Counter</option>
              <option value="security">Security</option>
            </select>
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
              placeholder="staff@example.com"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Phone
            </span>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="+855..."
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Salary
            </span>
            <input
              type="number"
              name="salary"
              min="0"
              value={form.salary}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Date of Birth
            </span>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
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
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(getInitialForm(selectedStaff))}
            className="rounded-md bg-[var(--bg-primary)]/80 px-5 py-3 text-md font-semibold text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[var(--bg-primary)] px-5 py-3 text-md font-semibold text-white"
          >
            {saving ? "Saving..." : isEditMode ? "Update Staff" : "Save Staff"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddStaff;
