import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api/api.js'

const getInitialForm = (hotel) => ({
  hotel_id: hotel?.hotel_id ?? '',
  hotel_name: hotel?.hotel_name ?? '',
  star_rating: hotel?.star_rating ?? '',
  street: hotel?.location?.street ?? '',
  city: hotel?.location?.city ?? '',
  country: hotel?.location?.country ?? '',
  phone: hotel?.contact?.phone ?? '',
  email: hotel?.contact?.email ?? '',
  available_rooms: hotel?.available_rooms ?? '',
  image: null,
})

const AddHotel = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedHotel = location.state?.hotel ?? null
  const isEditMode = Boolean(selectedHotel?._id)

  const [form, setForm] = useState(() => getInitialForm(selectedHotel))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value, files } = event.target

    setForm((current) => ({
      ...current,
      [name]: name === 'image' ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = new FormData()

      payload.append('hotel_id', form.hotel_id)
      payload.append('hotel_name', form.hotel_name)
      payload.append('star_rating', form.star_rating)
      payload.append(
        'location',
        JSON.stringify({
          street: form.street,
          city: form.city,
          country: form.country,
        }),
      )
      payload.append(
        'contact',
        JSON.stringify({
          phone: form.phone,
          email: form.email,
        }),
      )
      payload.append('available_rooms', form.available_rooms)

      if (form.image) {
        payload.append('image', form.image)
      }

      if (isEditMode) {
        await api.put(`/hotel/${selectedHotel._id}`, payload)
      } else {
        await api.post('/hotel', payload)
      }

      navigate('/hotels')
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          `Failed to ${isEditMode ? 'update' : 'add'} hotel`,
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex items-start justify-between gap-4">
        

        <button
          type="button"
          onClick={() => navigate('/hotels')}
          className="rounded-md  border border-slate-200 px-4 py-2 text-sm font-semibold bg-[var(--bg-primary)] text-white poppins transition "
        >
            <i class="fa-solid fa-arrow-left"></i>
            Back to Hotel
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
            <span className="text-sm  poppins text-green-800 font-semibold">Hotel ID</span>
            <input
              type="number"
              name="hotel_id"
              value={form.hotel_id}
              onChange={handleChange}
              className="w-full rounded-md border poppins border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Enter Hotel ID"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Hotel Name</span>
            <input
              type="text"
              name="hotel_name"
              value={form.hotel_name}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="RomduL Grand Hotel"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Star Rating</span>
            <input
              type="number"
              name="star_rating"
              value={form.star_rating}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="5"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Street</span>
            <input
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Street address"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">City</span>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Phnom Penh"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Country</span>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="Cambodia"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Phone</span>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="+855..."
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="hotel@example.com"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-green-900 poppins">Available Rooms</span>
            <input
              type="number"
              name="available_rooms"
              value={form.available_rooms}
              onChange={handleChange}
              min="0"
              className="w-full rounded-md poppins border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--bg-primary)]"
              placeholder="20"
            />
          </label>

          <label className="space-y-2 md:col-span-2 xl:col-span-3">
            <span className="text-sm font-semibold text-green-900 poppins py-2">Hotel Image</span> <br />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full poppins cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-6 text-sm text-slate-500 outline-none transition-all duration-200 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--bg-primary)] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:transition-transform file:hover:scale-105 hover:border-[var(--bg-primary)] hover:bg-[var(--bg-primary)]/5"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm(getInitialForm(selectedHotel))}
            className="rounded-md poppins  px-5 py-3 text-md font-semibold bg-[var(--bg-primary)]/80 text-white"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md poppins  px-5 py-3 text-md font-semibold bg-[var(--bg-primary)]/100 text-white"
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Hotel' : 'Save Hotel'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddHotel
