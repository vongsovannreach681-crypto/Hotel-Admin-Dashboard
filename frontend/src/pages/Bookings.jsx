import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, userRes, hotelRes, roomRes] = await Promise.all([
          api.get("/booking"),
          api.get("/users"),
          api.get("/hotel"),
          api.get("/rooms"),
        ]);

        setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
        setHotels(Array.isArray(hotelRes.data) ? hotelRes.data : []);
        setRooms(Array.isArray(roomRes.data) ? roomRes.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load bookings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userMap = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});
  }, [users]);

  const hotelMap = useMemo(() => {
    return hotels.reduce((acc, hotel) => {
      acc[hotel.hotel_id] = hotel;
      return acc;
    }, {});
  }, [hotels]);

  const roomMap = useMemo(() => {
    return rooms.reduce((acc, room) => {
      acc[room.room_id] = room;
      return acc;
    }, {});
  }, [rooms]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const user = userMap[booking.user_id];
      const hotel = hotelMap[booking.hotel_id];
      const room = roomMap[booking.room_id];

      const matchesSearch =
        !term ||
        String(booking.booking_id ?? "").toLowerCase().includes(term) ||
        String(user?.userName ?? "").toLowerCase().includes(term) ||
        String(hotel?.hotel_name ?? "").toLowerCase().includes(term) ||
        String(room?.room_number ?? "").toLowerCase().includes(term) ||
        String(room?.room_type ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        String(booking.status ?? "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter, userMap, hotelMap, roomMap]);

  const handleRowClick = (booking) => {
    navigate(`/bookings/${booking._id}`);
  };

  const handleEdit = (booking) => {
    navigate("/bookings/add", { state: { booking } });
  };

  const handleDelete = async (booking) => {
    const confirmed = window.confirm(
      `Delete booking "${booking.booking_id || booking._id}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/booking/${booking._id}`);
      setBookings((current) =>
        current.filter((item) => item._id !== booking._id),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete booking",
      );
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Booking</h1>
        <p className="mt-4 text-slate-600">Loading booking data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Booking</h1>
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
          onClick={() => navigate("/bookings/add")}
          className="rounded bg-[var(--bg-primary)] poppins px-4 py-2.5 text-md font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add Booking
        </button>

        <div className="relative flex-1 min-w-[240px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking, user, hotel, or room..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked in</option>
            <option value="checked_out">Checked out</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
          <span>
            {filteredBookings.length} of {bookings.length} bookings
          </span>
          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
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
                <tr className="text-center text-md font-semibold text-white">
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Check In</th>
                  <th className="px-4 py-3">Check Out</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white poppins">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const user = userMap[booking.user_id];
                    const hotel = hotelMap[booking.hotel_id];
                    const room = roomMap[booking.room_id];

                    return (
                      <tr
                        key={booking._id}
                        onClick={() => handleRowClick(booking)}
                        className="cursor-pointer text-center text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                          {booking.booking_id ?? "-"}
                        </td>
                        <td className="px-4 py-4">{user?.userName ?? booking.user_id ?? "-"}</td>
                        <td className="px-4 py-4">{hotel?.hotel_name ?? booking.hotel_id ?? "-"}</td>
                        <td className="px-4 py-4">
                          {room ? `${room.room_number} (${room.room_type})` : booking.room_id ?? "-"}
                        </td>
                        <td className="px-4 py-4">
                          {booking.check_in ? new Date(booking.check_in).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-4">
                          {booking.check_out ? new Date(booking.check_out).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-4">{booking.guests ?? "-"}</td>
                        <td className="px-4 py-4">{booking.total_price ?? "-"}</td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {booking.status ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(booking);
                              }}
                              title="Edit booking"
                              className="rounded-lg bg-[var(--bg-primary)]/70 px-4 py-4 text-sm font-medium text-white shadow-sm transition-all duration-150 active:scale-95"
                            >
                              <i className="fa-solid fa-pen text-xs"></i>
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(booking);
                              }}
                              title="Delete booking"
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
                      colSpan="10"
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No booking records found.
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

export default Bookings;
