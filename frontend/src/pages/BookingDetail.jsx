import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

const BookingDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking ?? null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.booking) return;

    const fetchBooking = async () => {
      try {
        const res = await api.get(`/booking/${id}`);
        setBooking(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load booking details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, location.state?.booking]);

  if (loading) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Booking Detail
        </h1>
        <p className="mt-4 text-slate-600">Loading booking details...</p>
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
          Booking Detail
        </h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!booking) return null;

  return (
    <section className="rounded-md bg-white px-10 py-10 shadow">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="rounded-full bg-[var(--bg-primary)] p-3 text-white"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>

        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Booking Detail
        </h1>
      </div>

      <div className="grid gap-6 rounded-xl border border-slate-200 p-6 md:grid-cols-2">
        <div className="space-y-3 text-slate-700">
          <p className="text-xl font-semibold text-[var(--bg-primary)]">
            Booking #{booking.booking_id ?? "-"}
          </p>
          <p>User: {booking.user_name ?? booking.user_id ?? "-"}</p>
          <p>Email: {booking.user_email ?? "-"}</p>
          <p>Hotel: {booking.hotel_name ?? booking.hotel_id ?? "-"}</p>
          <p>
            Room:{" "}
            {booking.room_number
              ? `${booking.room_number} (${booking.room_type ?? "-"})`
              : booking.room_id ?? "-"}
          </p>
        </div>

        <div className="space-y-3 text-slate-700">
          <p>Check In: {booking.check_in ? new Date(booking.check_in).toLocaleDateString() : "-"}</p>
          <p>Check Out: {booking.check_out ? new Date(booking.check_out).toLocaleDateString() : "-"}</p>
          <p>Nights: {booking.nights ?? "-"}</p>
          <p>Guests: {booking.guests ?? "-"}</p>
          <p>Total Price: {booking.total_price ?? "-"}</p>
          <p>Status: {booking.status ?? "-"}</p>
        </div>

        <div className="md:col-span-2">
          <p className="font-semibold text-slate-800">Notes</p>
          <p className="mt-2 rounded-lg bg-slate-50 p-4 text-slate-600">
            {booking.notes ?? "-"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          navigate("/bookings/add", {
            state: { booking: { ...booking, _id: id } },
          })
        }
        className="mt-6 rounded-md bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        Edit Booking
      </button>
    </section>
  );
};

export default BookingDetail;
