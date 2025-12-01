'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { Appointment } from '@/types'

export default function UserAppointmentsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (session?.user?.accountType !== 'user') {
      router.push('/dashboard')
      return
    }

    loadAppointments(session.user.id)
  }, [status, session, router])

  const loadAppointments = async (userId: number) => {
    try {
      setLoading(true)
      console.log('Loading appointments for userId:', userId)
      const res = await fetch(`/api/appointments?userId=${userId}`)
      const data = await res.json()
      console.log('Appointments response:', data)
      if (res.ok) {
        setAppointments(data.appointments || [])
      } else {
        setError('Failed to load appointments')
      }
    } catch (err) {
      console.error('Failed to load appointments:', err)
      setError('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    if (!session?.user) return

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', userId: session.user.id })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Appointment cancelled successfully')
        setError('')
        loadAppointments(session.user.id)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(data.error || 'Failed to cancel appointment')
        setMessage('')
      }
    } catch (err) {
      console.error('Cancel error:', err)
      setError('Failed to cancel appointment')
      setMessage('')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      PENDING: { bg: 'bg-yellow-500', text: 'Pending' },
      CONFIRMED: { bg: 'bg-green-500', text: 'Confirmed' },
      DENIED: { bg: 'bg-red-500', text: 'Denied' },
      CANCELLED: { bg: 'bg-gray-500', text: 'Cancelled' },
      COMPLETED: { bg: 'bg-blue-500', text: 'Completed' },
      RATED: { bg: 'bg-purple-500', text: 'Rated' }
    }
    const config = statusConfig[status] || { bg: 'bg-gray-500', text: status }
    return (
      <span className={`${config.bg} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
        {config.text}
      </span>
    )
  }

  const activeAppointments = appointments.filter(a => 
    ['PENDING', 'CONFIRMED'].includes(a.status)
  )
  const pastAppointments = appointments.filter(a => 
    ['DENIED', 'CANCELLED', 'COMPLETED', 'RATED'].includes(a.status)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.firstName}!</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Active Appointments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Appointments</h2>
          <div className="space-y-4">
            {activeAppointments.length === 0 ? (
              <div className="card">
                <p className="text-gray-500">No active appointments</p>
                <Link href="/search" className="btn-primary inline-block mt-4">
                  Find a Sharpener
                </Link>
              </div>
            ) : (
              activeAppointments.map((apt) => (
                <div key={apt.appointmentId} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {apt.sharpener?.firstName} {apt.sharpener?.lastName}
                      </h3>
                      {apt.status === 'CONFIRMED' && apt.sharpener?.phone && (
                        <p className="text-gray-700">📞 {apt.sharpener.phone}</p>
                      )}
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(apt.requestedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-gray-900">{apt.startTime} - {apt.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{apt.location?.locationName}</p>
                      {apt.status === 'CONFIRMED' && apt.location?.streetAddress ? (
                        <>
                          <p className="text-sm text-gray-700">{apt.location.streetAddress}</p>
                          <p className="text-sm text-gray-700">
                            {apt.location.city}, {apt.location.state} {apt.location.zipCode}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-700">
                          {apt.location?.city}, {apt.location?.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {apt.machine && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Machine</p>
                      <p className="text-gray-900">{apt.machine?.machineType}</p>
                    </div>
                  )}

                  {apt.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Your Notes</p>
                      <p className="text-gray-900">{apt.notes}</p>
                    </div>
                  )}

                  {apt.status === 'PENDING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        ⏳ Waiting for sharpener to accept your request
                      </p>
                    </div>
                  )}

                  {apt.status === 'CONFIRMED' && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                      <p className="text-sm text-green-800">
                        ✓ Your appointment has been confirmed! The sharpener will contact you.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleCancelAppointment(apt.appointmentId)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Past Appointments */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Appointments</h2>
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <div className="card">
                <p className="text-gray-500">No past appointments</p>
              </div>
            ) : (
              pastAppointments.map((apt) => (
                <div key={apt.appointmentId} className="card bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {apt.sharpener?.firstName} {apt.sharpener?.lastName}
                      </h3>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <p className="text-gray-900 mb-2">
                    {new Date(apt.requestedDate).toLocaleDateString()} at {apt.startTime}
                  </p>
                  <p className="text-sm text-gray-600">{apt.location?.locationName}</p>
                  <p className="text-sm text-gray-600">{apt.location?.city}, {apt.location?.state}</p>

                  {apt.status === 'DENIED' && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                      <p className="text-sm text-red-800">
                        This appointment was declined by the sharpener
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
