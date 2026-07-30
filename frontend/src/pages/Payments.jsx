import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const statusStyles = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payment");
        setPayments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Failed to load payments",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const statuses = useMemo(() => {
    const unique = new Set(payments.map((p) => p.status).filter(Boolean));
    return Array.from(unique).sort();
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !term ||
        String(payment.payment_id ?? "").toLowerCase().includes(term) ||
        String(payment.booking_id ?? "").toLowerCase().includes(term) ||
        payment.transaction?.toLowerCase?.().includes(term);

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const handleEdit = (payment) => {
    navigate("/payments/add", { state: { payment } });
  };

  const handleRowClick = (payment) => {
    navigate(`/payments/${payment._id}`);
  };

  const handleDelete = async (payment) => {
    const confirmed = window.confirm(
      `Delete payment "${payment.payment_id ?? payment._id}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/payment/${payment._id}`);
      setPayments((current) => current.filter((item) => item._id !== payment._id));
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to delete payment",
      );
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Payments</h1>
        <p className="mt-4 text-slate-600">Loading payment data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Payments</h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white rounded shadow p-4 mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/payments/add")}
          className="bg-[var(--bg-primary)] poppins rounded font-semibold text-md px-4 py-2.5 text-white shadow-sm transition hover:opacity-90"
        >
          <i className="fa-solid fa-plus"></i> Manage Payments
        </button>

        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by payment ID, booking ID, or transaction..."
            className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent poppins transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-50 rounded-lg pl-4 pr-9 py-2.5 text-sm poppins text-slate-700 border border-transparent outline-none cursor-pointer transition-all duration-200 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
        </div>

        {/* Result count + clear */}
        <div className="flex items-center gap-3 ml-auto text-sm text-slate-500 poppins">
          <span>
            {filteredPayments.length} of {payments.length} payments
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

      <section className="bg-white rounded shadow">
        <div className="overflow-hidden rounded border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-[var(--bg-primary)]">
                <tr className="text-center text-md font-semibold text-white poppins">
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Paid At</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y poppins divide-slate-200 bg-white">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      onClick={() => handleRowClick(payment)}
                      className="cursor-pointer text-sm text-center text-slate-700 hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                        {payment.payment_id ?? "-"}
                      </td>
                      <td className="px-4 py-4">{payment.booking_id ?? "-"}</td>
                      <td className="px-4 py-4 capitalize">
                        {payment.payment_method ?? "-"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            statusStyles[payment.status] ?? "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {payment.status ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">{payment.transaction ?? "-"}</td>
                      <td className="px-4 py-4">{formatDate(payment.paid_at)}</td>
                      <td>
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEdit(payment);
                            }}
                            title="Edit payment"
                            className="flex items-center gap-1.5 bg-[var(--bg-primary)]/70 text-white text-sm font-medium px-4 py-4 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
                          >
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(payment);
                            }}
                            title="Delete payment"
                            className="flex items-center gap-1.5 bg-[var(--bg-primary)] text-white text-sm font-medium px-4 py-4 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
                          >
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-sm text-slate-500">
                      No payment records found.
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

export default Payments;