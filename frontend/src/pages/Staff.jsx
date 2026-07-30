import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const Staff = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, hotelRes] = await Promise.all([
          api.get("/staff"),
          api.get("/hotel"),
        ]);

        setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
        setHotels(Array.isArray(hotelRes.data) ? hotelRes.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load staff",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hotelMap = useMemo(() => {
    return hotels.reduce((acc, hotel) => {
      acc[hotel.hotel_id] = hotel;
      return acc;
    }, {});
  }, [hotels]);

  const filteredStaff = useMemo(() => {
    const term = search.trim().toLowerCase();

    return staff.filter((member) => {
      const hotel = hotelMap[member.hotel_id];
      const matchesSearch =
        !term ||
        String(member.staff_id ?? "").toLowerCase().includes(term) ||
        String(member.full_name ?? "").toLowerCase().includes(term) ||
        String(member.position ?? "").toLowerCase().includes(term) ||
        String(hotel?.hotel_name ?? "").toLowerCase().includes(term) ||
        String(member.contact?.email ?? "").toLowerCase().includes(term);

      const matchesPosition =
        positionFilter === "all" ||
        String(member.position ?? "").toLowerCase() === positionFilter;

      return matchesSearch && matchesPosition;
    });
  }, [staff, search, positionFilter, hotelMap]);

  const handleRowClick = (member) => {
    navigate(`/staff/${member._id}`);
  };

  const handleEdit = (member) => {
    navigate("/staff/add", { state: { staff: member } });
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Delete staff "${member.full_name || member.staff_id}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/staff/${member._id}`);
      setStaff((current) => current.filter((item) => item._id !== member._id));
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to delete staff",
      );
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Staff</h1>
        <p className="mt-4 text-slate-600">Loading staff data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Staff</h1>
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
          onClick={() => navigate("/staff/add")}
          className="rounded poppins bg-[var(--bg-primary)] px-4 py-2.5 text-md font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add Staff
        </button>

        <div className="relative flex-1 min-w-[240px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, position, or email..."
            className="w-full poppins rounded-lg border border-transparent bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          />
        </div>

        <div className="relative">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="cursor-pointer poppins appearance-none rounded-lg border border-transparent bg-slate-50 py-2.5 pl-4 pr-9 text-sm text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          >
            <option value="all">All positions</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="cleaner">Cleaner</option>
            <option value="counter">Counter</option>
            <option value="security">Security</option>
          </select>
          <i className="fa-solid poppins fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
          <span>
            {filteredStaff.length} of {staff.length} staff
          </span>
          {(search || positionFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPositionFilter("all");
              }}
              className="text-[var(--bg-primary)] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="rounded bg-white shadow">
        <div className="overflow-hidden rounded border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-[var(--bg-primary)] poppins">
                <tr className="text-center text-md font-semibold  text-white">
                  <th className="px-4 py-3">Staff ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Salary</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 poppins bg-white">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((member) => {
                    const hotel = hotelMap[member.hotel_id];

                    return (
                      <tr
                        key={member._id}
                        onClick={() => handleRowClick(member)}
                        className="cursor-pointer text-center text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                          {member.staff_id ?? "-"}
                        </td>
                        <td className="px-4 py-4">{member.full_name ?? "-"}</td>
                        <td className="px-4 py-4">
                          {hotel?.hotel_name ?? member.hotel_id ?? "-"}
                        </td>
                        <td className="px-4 py-4">{member.position ?? "-"}</td>
                        <td className="px-4 py-4">{member.contact?.email ?? "-"}</td>
                        <td className="px-4 py-4">{member.contact?.phone ?? "-"}</td>
                        <td className="px-4 py-4">{member.salary ?? "-"}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              member.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(member);
                              }}
                              title="Edit staff"
                              className="rounded-lg bg-[var(--bg-primary)]/70 px-4 py-4 text-sm font-medium text-white shadow-sm transition-all duration-150 active:scale-95"
                            >
                              <i className="fa-solid fa-pen text-xs"></i>
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(member);
                              }}
                              title="Delete staff"
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
                      colSpan="9"
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No staff records found.
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

export default Staff;
