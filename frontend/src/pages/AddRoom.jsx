import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const getInitialForm = (room) => ({
  room_id: room?.room_id ?? "",
  hotel_id: room?.hotel_id ?? "",
  booking_id: room?.booking_id ?? "",
  room_number: room?.room_number ?? "",
  room_type: room?.room_type ?? "",
  floor: room?.floor ?? "",
  description: room?.description ?? "",
  price_per_night: room?.room_information?.price_per_night ?? "",
  status:
    room?.room_information?.status === undefined
      ? "true"
      : room.room_information.status
        ? "true"
        : "false",
  bed_type: room?.room_information?.bed_type ?? "",
  image: [],
});

const AddRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRoom = location.state?.room ?? null;
  const isEditMode = Boolean(selectedRoom?._id);

  const [form, setForm] = useState(() => getInitialForm(selectedRoom));
  const [hotels, setHotels] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingHotels, setLoadingHotels] = useState(true);

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
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "image" ? Array.from(files ?? []) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = new FormData();

      payload.append("room_id", form.room_id);
      payload.append("hotel_id", form.hotel_id);
      payload.append("booking_id", form.booking_id);
      payload.append("room_number", form.room_number);
      payload.append("room_type", form.room_type);
      payload.append("floor", form.floor);
      payload.append("description", form.description);
      payload.append(
        "room_information",
        JSON.stringify({
          price_per_night: form.price_per_night,
          status: form.status === "true",
          bed_type: form.bed_type,
        }),
      );

      form.image.forEach((file) => {
        payload.append("image", file);
      });

      if (isEditMode) {
        await api.put(`/rooms/${selectedRoom._id}`, payload);
      } else {
        await api.post("/rooms", payload);
      }

      navigate("/rooms");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? "update" : "add"} room`,
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
          onClick={() => navigate("/rooms")}
          className="rounded-md border border-slate-200 bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Room
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
              Room ID
            </span>
            <input
              type="number"
              name="room_id"
              value={form.room_id}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Enter Room ID"
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
              disabled={loadingHotels}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)] disabled:bg-slate-100"
            >
              <option value="">
                {loadingHotels ? "Loading hotels..." : "Select hotel"}
              </option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel.hotel_id}>
                  {hotel.hotel_name} ({hotel.hotel_id})
                </option>
              ))}
            </select>
          </label>

          

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Room Number
            </span>
            <input
              type="number"
              name="room_number"
              value={form.room_number}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="101"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Room Type
            </span>
            <input
              type="text"
              name="room_type"
              value={form.room_type}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Deluxe Double"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Floor
            </span>
            <input
              type="number"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="3"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Price per Night
            </span>
            <input
              type="number"
              name="price_per_night"
              value={form.price_per_night}
              onChange={handleChange}
              min="0"
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="85"
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
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
            >
              <option value="true">Available</option>
              <option value="false">Occupied</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">
              Bed Type
            </span>
            <input
              type="text"
              name="bed_type"
              value={form.bed_type}
              onChange={handleChange}
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="King / Queen / Twin"
            />
          </label>

          <label className="space-y-2 md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-green-900 poppins">
              Description
            </span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full poppins rounded-md border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Short room description"
            />
          </label>

          <label className="space-y-2 md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-green-900 poppins">
              Room Images
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-6 text-sm text-slate-500 outline-none transition-all duration-200 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--bg-primary)] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition-transform file:hover:scale-105 hover:border-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/5"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(getInitialForm(selectedRoom))}
            className="rounded-md bg-[var(--bg-primary)]/80 px-5 py-3 text-md font-semibold text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[var(--bg-primary)] px-5 py-3 text-md font-semibold text-white"
          >
            {saving ? "Saving..." : isEditMode ? "Update Room" : "Save Room"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddRoom;
