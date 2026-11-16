import { useState, useEffect } from 'react'
import api from '../../api/api'

const Card = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms')
            setRooms(res.data)
        } catch (ex) {
            console.error(ex)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    if (loading) {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] max-w-6xl mx-auto mt-8'>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className='h-72 rounded-2xl bg-neutral-100 animate-pulse' />
                ))}
            </div>
        )
    }

    if (rooms.length === 0) {
        return <p className='text-center text-neutral-400 mt-10'>No rooms available.</p>
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] max-w-6xl mx-auto mt-8'>
            {rooms.map((room) => {
                const { price_per_night, status, bed_type } = room.room_information || {}

                return (
                    <div
                        key={room._id}
                        className='group rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-shadow duration-300'
                    >
                        <div className='relative h-48 overflow-hidden'>
                            <img
                                src={room.image?.[0]}
                                alt={room.room_type}
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                            />
                            <span className='absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold'>
                                ${price_per_night} / night
                            </span>
                            <span
                                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                                    status
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-600'
                                }`}
                            >
                                {status ? 'Available' : 'Booked'}
                            </span>
                        </div>

                        <div className='p-5'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-lg font-semibold text-neutral-800'>{room.room_type}</h3>
                                <span className='text-xs text-neutral-400'>Floor {room.floor}</span>
                            </div>

                            <p className='text-sm text-neutral-500 mt-1'>{bed_type}</p>
                            <p className='text-sm text-neutral-500 mt-1 line-clamp-2'>{room.description}</p>

                            <button
                                disabled={!status}
                                className={`mt-4 w-full py-2.5 rounded-full text-sm font-medium transition-colors ${
                                    status
                                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                }`}
                            >
                                {status ? 'View details' : 'Unavailable'}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Card