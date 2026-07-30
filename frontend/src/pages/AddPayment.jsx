import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const PAYMENT_METHODS = ["cash", "card", "bank_transfer", "mobile_payment", "bakong_khqr"];
const STATUSES = ["pending", "paid", "failed", "refunded"];

const toDateTimeLocal = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

const getInitialForm = (payment) => ({
  payment_id: payment?.payment_id ?? "",
  booking_id: payment?.booking_id ?? "",
  payment_method: payment?.payment_method ?? PAYMENT_METHODS[0],
  status: payment?.status ?? STATUSES[0],
  transaction: payment?.transaction ?? "",
  paid_at: toDateTimeLocal(payment?.paid_at),
});

const AddPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPayment = location.state?.payment ?? null;
  const isEditMode = Boolean(selectedPayment?._id);

  const [form, setForm] = useState(() => getInitialForm(selectedPayment));
  const [bookings, setBookings] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/booking");
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load bookings",
        );
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        payment_id: form.payment_id ? Number(form.payment_id) : undefined,
        booking_id: form.booking_id ? Number(form.booking_id) : undefined,
        payment_method: form.payment_method,
        status: form.status,
        transaction: form.transaction || undefined,
        paid_at: form.paid_at ? new Date(form.paid_at).toISOString() : undefined,
      };

      if (isEditMode) {
        await api.patch(`/payment/${selectedPayment._id}`, payload);
      } else {
        await api.post("/payment", payload);
      }

      navigate("/payments");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "add"} payment`,
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
          onClick={() => navigate("/payments")}
          className="rounded-md border border-slate-200 bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Payments
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
            <span className="text-sm font-semibold text-green-900 poppins">
              Payment ID
            </span>
            <input
              type="number"
              name="payment_id"
              value={form.payment_id}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Enter Payment ID"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Booking
            </span>
            <select
              name="booking_id"
              value={form.booking_id}
              onChange={handleChange}
              disabled={loadingBookings}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)] disabled:bg-slate-100"
            >
              <option value="">
                {loadingBookings ? "Loading bookings..." : "Select booking"}
              </option>
              {bookings.map((booking) => (
                <option key={booking._id} value={booking.booking_id}>
                  Booking #{booking.booking_id}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Payment Method
            </span>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition capitalize focus:border-[var(--bg-primary)]"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method} className="capitalize">
                  {method.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Status
            </span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition capitalize focus:border-[var(--bg-primary)]"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Paid At
            </span>
            <input
              type="datetime-local"
              name="paid_at"
              value={form.paid_at}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            />
          </label>

          <label className="space-y-2 md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-green-900 poppins">
              Transaction Reference
            </span>
            <input
              type="text"
              name="transaction"
              value={form.transaction}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="e.g. TXN-0001 or Bakong hash"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(getInitialForm(selectedPayment))}
            className="rounded-md bg-[var(--bg-primary)]/80 px-5 py-3 text-md font-semibold text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[var(--bg-primary)] px-5 py-3 text-md font-semibold text-white"
          >
            {saving ? "Saving..." : isEditMode ? "Update Payment" : "Save Payment"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddPayment;