import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/api.js";

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `http://localhost:3000/${image.replace(/^\/+/, "")}`;
};

const RoomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [room, setRoom] = useState(location.state?.room ?? null);
  const [loading, setLoading] = useState(!location.state?.room);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state?.room) return;

    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load room details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, location.state?.room]);

  const images = useMemo(() => {
    const list = Array.isArray(room?.image) ? room.image : [];
    return list.filter(Boolean);
  }, [room]);

  if (loading) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Room Detail
        </h1>
        <p className="mt-4 text-slate-600">Loading room details...</p>
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
          Room Detail
        </h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!room) return null;

  const mainImage = getImageUrl(images[0]);
  const status = room.room_information?.status ? "Available" : "Occupied";

  return (
    <section className="rounded-md bg-white px-10 py-10 shadow">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/rooms")}
          className="rounded-full bg-[var(--bg-primary)] p-3 text-white"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>

        <div>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Room Detail
          </h1>
        </div>
      </div>

      <div className="flex gap-10 items-start">
        <div className="shrink-0">
          {mainImage ? (
            <img
              src={mainImage}
              alt={room.room_type || "Room"}
              className="h-[420px] w-[620px] rounded-md object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-[420px] w-[620px] items-center justify-center rounded-md bg-slate-100 text-sm text-slate-400">
              No image
            </div>
          )}

          {images.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {images.slice(0, 4).map((image) => (
                <img
                  key={image}
                  src={getImageUrl(image)}
                  alt={room.room_type || "Room"}
                  className="h-20 w-28 rounded-md object-cover shadow-sm"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-[var(--bg-primary)]">
            {room.room_type || "-"}
          </h2>

          <p className="mt-4 text-xl font-medium text-gray-700">
            Room ID: {room.room_id ?? "-"}
          </p>

          <p className="mt-3 text-xl font-medium text-gray-700">
            Hotel: {room.hotel_name || room.hotel_id || "-"}
          </p>

          <p className="mt-3 text-xl font-medium text-gray-700">
            Room Number: {room.room_number ?? "-"}
          </p>

          <p className="mt-3 text-xl font-medium text-gray-700">
            Floor: {room.floor ?? "-"}
          </p>

          <p className="mt-3 text-xl font-medium text-gray-700">
            Price per Night: {room.room_information?.price_per_night ?? "-"}
          </p>

          <p className="mt-3 text-xl font-medium text-gray-700">
            Status: {status}{" "}
            <i
              className={`fa-solid fa-circle text-xs ${
                room.room_information?.status
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            />
          </p>

          <p className="mt-3 text-xl font-medium text-gray-700">
            Bed Type: {room.room_information?.bed_type ?? "-"}
          </p>

          <p className="mt-5 text-md font-medium text-gray-700">
            <i className="fa-solid fa-note-sticky" /> Description:
            <br />
            <span className="pl-10">{room.description ?? "-"}</span>
          </p>

          <p className="mt-5 text-md font-medium text-gray-700">
            <i className="fa-solid fa-location-dot" /> Hotel Location:
            <br />
            <span className="pl-10">
              Street: {room.location?.street ?? "-"}
              <br />
            </span>
            <span className="pl-10">
              City: {room.location?.city ?? "-"}
              <br />
            </span>
            <span className="pl-10">Country: {room.location?.country ?? "-"}</span>
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/rooms/add", {
                state: {
                  room: {
                    ...room,
                    _id: id,
                  },
                },
              })
            }
            className="mt-6 rounded-md bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Edit Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomDetail;
