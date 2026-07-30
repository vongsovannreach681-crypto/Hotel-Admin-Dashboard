import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const getInitialForm = (booking) => ({
  booking_id: booking?.booking_id ?? "",
  user_id: booking?.user_id ?? "",
  hotel_id: booking?.hotel_id ?? "",
  room_id: booking?.room_id ?? "",
  check_in: booking?.check_in ? String(booking.check_in).slice(0, 10) : "",
  check_out: booking?.check_out ? String(booking.check_out).slice(0, 10) : "",
  guests: booking?.guests ?? 1,
  total_price: booking?.total_price ?? "",
  status: booking?.status ?? "pending",
  notes: booking?.notes ?? "",
});

const AddBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedBooking = location.state?.booking ?? null;
  const isEditMode = Boolean(selectedBooking?._id);

  const [form, setForm] = useState(() => getInitialForm(selectedBooking));
  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [userRes, hotelRes, roomRes] = await Promise.all([
          api.get("/users"),
          api.get("/hotel"),
          api.get("/rooms"),
        ]);

        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
        setHotels(Array.isArray(hotelRes.data) ? hotelRes.data : []);
        setRooms(Array.isArray(roomRes.data) ? roomRes.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load booking lookup data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLookups();
  }, []);

  const roomOptions = useMemo(() => {
    if (!form.hotel_id) return rooms;
    return rooms.filter((room) => String(room.hotel_id) === String(form.hotel_id));
  }, [rooms, form.hotel_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      if (name === "room_id") {
        const selectedRoom = rooms.find((room) => String(room.room_id) === value);
        return {
          ...current,
          room_id: value,
          hotel_id: selectedRoom?.hotel_id ?? current.hotel_id,
        };
      }

      if (name === "hotel_id") {
        return {
          ...current,
          hotel_id: value,
          room_id:
            current.room_id &&
            rooms.some(
              (room) =>
                String(room.room_id) === String(current.room_id) &&
                String(room.hotel_id) === String(value),
            )
              ? current.room_id
              : "",
        };
      }

      return {
        ...current,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        booking_id: form.booking_id,
        user_id: form.user_id,
        hotel_id: form.hotel_id,
        room_id: form.room_id,
        check_in: form.check_in,
        check_out: form.check_out,
        guests: form.guests,
        total_price: form.total_price,
        status: form.status,
        notes: form.notes,
      };

      if (isEditMode) {
        await api.put(`/booking/${selectedBooking._id}`, payload);
      } else {
        await api.post("/booking", payload);
      }

      navigate("/bookings");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "add"} booking`,
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
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Booking</h1>
        <p className="mt-4 text-slate-600">Loading booking form...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="rounded-md border border-slate-200 bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Booking
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
              Booking ID
            </span>
            <input
              type="number"
              name="booking_id"
              value={form.booking_id}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Enter booking ID"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              User
            </span>
            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user.userId}>
                  {user.userName} ({user.userId})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Hotel
            </span>
            <select
              name="hotel_id"
              value={form.hotel_id}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
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
              Room
            </span>
            <select
              name="room_id"
              value={form.room_id}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="">Select room</option>
              {roomOptions.map((room) => (
                <option key={room._id} value={room.room_id}>
                  {room.room_number} - {room.room_type} ({room.room_id})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Check In
            </span>
            <input
              type="date"
              name="check_in"
              value={form.check_in}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Check Out
            </span>
            <input
              type="date"
              name="check_out"
              value={form.check_out}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Guests
            </span>
            <input
              type="number"
              name="guests"
              min="1"
              value={form.guests}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="1"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Total Price
            </span>
            <input
              type="number"
              name="total_price"
              min="0"
              value={form.total_price}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="120"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Status
            </span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-green-900 poppins">
              Notes
            </span>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Optional booking notes"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(getInitialForm(selectedBooking))}
            className="rounded-md bg-[var(--bg-primary)]/80 px-5 py-3 text-md poppins font-semibold text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[var(--bg-primary)] px-5 py-3 text-md poppins font-semibold text-white"
          >
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Booking"
                : "Save Booking"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddBooking;
