import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/api.js'

const getImageUrl = (image) => {
  if (!image) return null
  if (image.startsWith('http://') || image.startsWith('https://')) return image
  return `http://localhost:3000/${image.replace(/^\/+/, '')}`
}

const HotelDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/hotel/${id}`)
        setHotel(res.data)
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            'Failed to load hotel details',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchHotel()
  }, [id])

  if (loading) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Hotel Detail
        </h1>
        <p className="mt-4 text-slate-600">Loading hotel details...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-md bg-white p-6 shadow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--bg-primary)]">
          RomduL Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Hotel Detail
        </h1>
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      </section>
    )
  }

  if (!hotel) return null

  const imageUrl = getImageUrl(hotel.image)
  return (
    <section className="rounded-md bg-white  px-10 py-30 shadow">
      <br /><br />
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/hotels')}
          className="bg-[var(--bg-primary)] p-3 rounded-full text-white cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left" />
        </button>

        <div>
          
          <h1 className="mt-1 text-3xl font-semibold poppins text-slate-900">
            Hotel Detail
          </h1>
        </div>

        
      </div>

      <div className="flex gap-10 items-start">
        <div className="shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={hotel.hotel_name || 'Hotel'}
              className="h-[420px] w-[620px] rounded-md object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-[420px] w-[620px] items-center justify-center rounded-md bg-slate-100 text-sm text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="poppins text-3xl font-semibold text-[var(--bg-primary)]">
            {hotel.hotel_name || '-'}
          </h2>

          <p className="poppins mt-4 text-xl font-medium text-gray-700">
            Hotel ID: {hotel.hotel_id ?? '-'}
          </p>

          <p className="poppins mt-3 text-xl font-medium text-gray-700">
            Available Rooms: {hotel.available_rooms ?? '-'}
          </p>

          <p className="poppins mt-3 text-xl font-medium text-gray-700">
            Rating: {hotel.star_rating ?? '-'}{' '}
            <i className="fa-solid fa-star text-yellow-600" />
          </p>

          <p className="poppins mt-5 text-md font-medium text-gray-700">
            <i className="fa-solid fa-location-dot" /> Location:
            <br />
            <span className="pl-10">
              Street: {hotel.location?.street ?? '-'}
              <br />
            </span>
            <span className="pl-10">
              City: {hotel.location?.city ?? '-'}
              <br />
            </span>
            <span className="pl-10">
              Country: {hotel.location?.country ?? '-'}
            </span>
          </p>

          <p className="poppins mt-5 text-md font-medium text-gray-700">
            <i className="fa-solid fa-book" /> Contact:
            <br />
            <span className="pl-10">Phone: {hotel.contact?.phone ?? '-'}</span>
            <br />
            <span className="pl-10">Email: {hotel.contact?.email ?? '-'}</span>
          </p>
          <br />
          <button
          type="button"
          onClick={() => navigate('/hotels/add', { state: { hotel } })}
          className="ml-auto rounded-md bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-white poppins"
        >
          Edit Hotel
        </button>
        </div>
      </div>
      <br /><br />
    </section>
  )
}

export default HotelDetail
