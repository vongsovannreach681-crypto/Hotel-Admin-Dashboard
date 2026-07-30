import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

const StaffDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [staff, setStaff] = useState(location.state?.staff ?? null);
  const [loading, setLoading] = useState(!location.state?.staff);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.staff) return;

    const fetchStaff = async () => {
      try {
        const res = await api.get(`/staff/${id}`);
        setStaff(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load staff details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id, location.state?.staff]);

  if (loading) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Staff Detail
        </h1>
        <p className="mt-4 text-slate-600">Loading staff details...</p>
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
          Staff Detail
        </h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!staff) return null;

  return (
    <section className="rounded-md bg-white px-10 py-10 shadow">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/staff")}
          className="rounded-full bg-[var(--bg-primary)] p-3 text-white"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Staff Detail
        </h1>
      </div>

      <div className="grid gap-6 rounded-xl border border-slate-200 p-6 md:grid-cols-2">
        <div className="space-y-3 text-slate-700">
          <p className="text-xl font-semibold text-[var(--bg-primary)]">
            {staff.full_name ?? "-"}
          </p>
          <p>Staff ID: {staff.staff_id ?? "-"}</p>
          <p>Hotel: {staff.hotel_name ?? staff.hotel_id ?? "-"}</p>
          <p>Position: {staff.position ?? "-"}</p>
          <p>Active: {staff.isActive ? "Yes" : "No"}</p>
        </div>

        <div className="space-y-3 text-slate-700">
          <p>Email: {staff.contact?.email ?? "-"}</p>
          <p>Phone: {staff.contact?.phone ?? "-"}</p>
          <p>Salary: {staff.salary ?? "-"}</p>
          <p>
            Date of Birth:{" "}
            {staff.date_of_birth
              ? new Date(staff.date_of_birth).toLocaleDateString()
              : "-"}
          </p>
          <p>Location: {staff.location?.city ?? "-"} {staff.location?.country ? `, ${staff.location.country}` : ""}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          navigate("/staff/add", {
            state: { staff: { ...staff, _id: id } },
          })
        }
        className="mt-6 rounded-md bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        Edit Staff
      </button>
    </section>
  );
};

export default StaffDetail;
