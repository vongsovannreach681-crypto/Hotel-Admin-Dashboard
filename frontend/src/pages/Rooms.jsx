import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const getImageUrl = (image) => {
  if (!image) return null;
  const firstImage = Array.isArray(image) ? image[0] : image;
  if (!firstImage) return null;
  if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
    return firstImage;
  }
  return `http://localhost:3000/${firstImage.replace(/^\/+/, "")}`;
};

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [hotelFilter, setHotelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, hotelsRes] = await Promise.all([
          api.get("/rooms"),
          api.get("/hotel"),
        ]);

        setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
        setHotels(Array.isArray(hotelsRes.data) ? hotelsRes.data : []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load rooms",
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

  const hotelOptions = useMemo(() => {
    const uniqueHotels = Array.from(
      new Map(
        hotels
          .filter((hotel) => hotel.hotel_id !== undefined && hotel.hotel_name)
          .map((hotel) => [hotel.hotel_id, hotel]),
      ).values(),
    );

    return uniqueHotels.sort((a, b) =>
      String(a.hotel_name).localeCompare(String(b.hotel_name)),
    );
  }, [hotels]);

  const filteredRooms = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rooms.filter((room) => {
      const hotel = hotelMap[room.hotel_id];
      const status = room.room_information?.status ? "available" : "occupied";

      const matchesSearch =
        !term ||
        String(room.room_number ?? "").toLowerCase().includes(term) ||
        String(room.room_type ?? "").toLowerCase().includes(term) ||
        String(room.floor ?? "").toLowerCase().includes(term) ||
        String(room.description ?? "").toLowerCase().includes(term) ||
        String(room.room_information?.bed_type ?? "").toLowerCase().includes(
          term,
        ) ||
        String(hotel?.hotel_name ?? "").toLowerCase().includes(term);

      const matchesHotel =
        hotelFilter === "all" || String(room.hotel_id) === hotelFilter;
      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesHotel && matchesStatus;
    });
  }, [rooms, search, hotelFilter, statusFilter, hotelMap]);

  const handleRowClick = (room) => {
    navigate(`/rooms/${room._id}`, { state: { room } });
  };

  const handleEdit = (room) => {
    navigate("/rooms/add", { state: { room } });
  };

  const handleDelete = async (room) => {
    const confirmed = window.confirm(
      `Delete room "${room.room_type || room.room_number}"?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/rooms/${room._id}`);
      setRooms((current) => current.filter((item) => item._id !== room._id));
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to delete room",
      );
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Room</h1>
        <p className="mt-4 text-slate-600">Loading room data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Room</h1>
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
          onClick={() => navigate("/rooms/add")}
          className="rounded poppins bg-[var(--bg-primary)] px-4 py-2.5 text-md font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add Room
        </button>

        <div className="relative flex-1 min-w-[240px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"></i>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by room, hotel, floor, or bed type..."
            className="w-full poppins rounded-lg border border-transparent bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          />
        </div>

        <div className="relative">
          <select
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
            className="cursor-pointer poppins appearance-none rounded-lg border border-transparent bg-slate-50 py-2.5 pl-4 pr-9 text-sm text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          >
            <option value="all">All hotels</option>
            {hotelOptions.map((hotel) => (
              <option key={hotel.hotel_id} value={hotel.hotel_id}>
                {hotel.hotel_name}
              </option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer poppins appearance-none rounded-lg border border-transparent bg-slate-50 py-2.5 pl-4 pr-9 text-sm text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:border-[var(--bg-primary)]/40 focus:ring-2 focus:ring-[var(--bg-primary)]/10"
          >
            <option value="all">All status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>
          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
          <span>
            {filteredRooms.length} of {rooms.length} rooms
          </span>
          {(search || hotelFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setHotelFilter("all");
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
                  <th className="px-4 py-3">Room ID</th>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Room No.</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Floor</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Bed Type</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 poppins bg-white">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => {
                    const hotel = hotelMap[room.hotel_id];
                    const imageUrl = getImageUrl(room.image);
                    const isAvailable = Boolean(room.room_information?.status);

                    return (
                      <tr
                        key={room._id}
                        onClick={() => handleRowClick(room)}
                        className="cursor-pointer text-center text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                          {room.room_id ?? "-"}
                        </td>
                        <td className="px-4 py-4">
                          {hotel?.hotel_name ?? room.hotel_id ?? "-"}
                        </td>
                        <td className="px-4 py-4">{room.room_number ?? "-"}</td>
                        <td className="px-4 py-4">{room.room_type ?? "-"}</td>
                        <td className="px-4 py-4">{room.floor ?? "-"}</td>
                        <td className="px-4 py-4">
                          {room.room_information?.price_per_night ?? "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isAvailable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isAvailable ? "Available" : "Occupied"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {room.room_information?.bed_type ?? "-"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={room.room_type || "Room"}
                                className="h-14 w-20 rounded-lg object-cover shadow-sm"
                              />
                            ) : (
                              <span className="text-slate-400">No image</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEdit(room);
                              }}
                              title="Edit room"
                              className="rounded-lg bg-[var(--bg-primary)]/70 px-4 py-4 text-sm font-medium text-white shadow-sm transition-all duration-150 active:scale-95"
                            >
                              <i className="fa-solid fa-pen text-xs"></i>
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(room);
                              }}
                              title="Delete room"
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
                      No room records found.
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

export default Rooms;
