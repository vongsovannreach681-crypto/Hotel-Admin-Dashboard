import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import bannerImage from "../assets/images/Banner2.png";
import logo from "../assets/images/RomduLLogo.png";

const collections = [
  { label: "Hotels", route: "/hotels", endpoint: "/hotel", icon: "fa-hotel" },
  { label: "Rooms", route: "/rooms", endpoint: "/rooms", icon: "fa-bed" },
  {
    label: "Bookings",
    route: "/bookings",
    endpoint: "/booking",
    icon: "fa-calendar-days",
  },
  {
    label: "Payments",
    route: "/payments",
    endpoint: "/payment",
    icon: "fa-credit-card",
  },
  { label: "Users", route: "/users", endpoint: "/users", icon: "fa-users" },
  { label: "Staff", route: "/staff", endpoint: "/staff", icon: "fa-user-tie" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const responses = await Promise.all(
          collections.map((item) => api.get(item.endpoint)),
        );

        const nextCounts = {};
        responses.forEach((res, index) => {
          nextCounts[collections[index].label] = Array.isArray(res.data)
            ? res.data.length
            : 0;
        });
        setCounts(nextCounts);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const summary = useMemo(() => {
    const hotels = counts.Hotels ?? 0;
    const rooms = counts.Rooms ?? 0;
    const bookings = counts.Bookings ?? 0;
    return [
      { label: "Hotels", value: hotels },
      { label: "Rooms", value: rooms },
      { label: "Bookings", value: bookings },
    ];
  }, [counts]);

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)] poppins">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 poppins">Dashboard</h1>
        <p className="mt-4 text-slate-600 poppins">Loading dashboard data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)] poppins">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 poppins">Dashboard</h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 poppins">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)] poppins">
          RomduL Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 poppins">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((item) => {
          const count = counts[item.label] ?? 0;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.route)}
              className="group rounded-2xl border-l-4 border-[var(--bg-primary)] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-primary)]/10 text-[var(--bg-primary)]">
                    <i className={`fa-solid ${item.icon}`} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 poppins">
                    {item.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold text-slate-900 poppins">
                    {count}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--bg-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--bg-primary)] poppins">
                  Open
                </span>
              </div>

              <p className="mt-5 text-sm text-slate-500 poppins">
                Go to {item.label.toLowerCase()} list
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;