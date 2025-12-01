'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import type { 
  SharpenerLocation, 
  SharpeningMachine, 
  Availability, 
  Appointment,
  LocationFormData,
  MachineFormData,
  AvailabilityFormData
} from '@/types'

export default function SharpenerDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('locations')
  const [locations, setLocations] = useState<SharpenerLocation[]>([])
  const [machines, setMachines] = useState<SharpeningMachine[]>([])
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [selectedMachine, setSelectedMachine] = useState<number | null>(null)
  const [editingLocation, setEditingLocation] = useState<number | null>(null)
  const [editingMachine, setEditingMachine] = useState<number | null>(null)

  // Location form
  const [locationForm, setLocationForm] = useState<LocationFormData>({
    locationName: '',
    streetAddress: '',
    city: 'Munich',
    state: 'Bayern',
    zipCode: ''
  })

  // Machine form
  const [machineForm, setMachineForm] = useState<MachineFormData>({
    machineType: '',
    radiusOptions: ''
  })

  // Availability form
  const [availabilityForm, setAvailabilityForm] = useState<AvailabilityFormData>({
    availableDate: '',
    startTime: '',
    endTime: '',
    price: '',
    repeatWeeks: '1'
  })

  const [editingAvailability, setEditingAvailability] = useState<number | null>(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Redirect if not authenticated or not a sharpener
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (session?.user?.accountType !== 'sharpener') {
      router.push('/search')
      return
    }

    loadLocations(session.user.id)
    loadAppointments(session.user.id)
  }, [status, session, router])

  const loadLocations = async (sharpenerId: number) => {
    try {
      const res = await fetch(`/api/sharpener/locations?sharpenerId=${sharpenerId}`)
      const data = await res.json()
      if (res.ok) {
        setLocations(data.locations || [])
        if (data.locations && data.locations.length > 0) {
          setSelectedLocation(data.locations[0].locationId)
          loadMachines(data.locations[0].locationId)
        }
      }
    } catch (err) {
      console.error('Failed to load locations')
    }
  }

  const loadMachines = async (locationId: number) => {
    try {
      const res = await fetch(`/api/sharpener/machines?locationId=${locationId}`)
      const data = await res.json()
      if (res.ok) {
        setMachines(data.machines || [])
        if (data.machines && data.machines.length > 0) {
          setSelectedMachine(data.machines[0].machineId)
          loadAvailabilities(locationId, data.machines[0].machineId)
        }
      }
    } catch (err) {
      console.error('Failed to load machines')
    }
  }

  const loadAvailabilities = async (locationId: number, machineId?: number) => {
    try {
      let url = `/api/sharpener/availability?locationId=${locationId}`
      if (machineId) url += `&machineId=${machineId}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        // Sort availabilities by date and time (ascending)
        const sorted = (data.availabilities || []).sort((a: any, b: any) => {
          const dateA = new Date(`${a.availableDate}T${a.startTime}`)
          const dateB = new Date(`${b.availableDate}T${b.startTime}`)
          return dateA.getTime() - dateB.getTime()
        })
        setAvailabilities(sorted)
      }
    } catch (err) {
      console.error('Failed to load availabilities')
    }
  }

  const loadAppointments = async (sharpenerId: number) => {
    try {
      console.log('Loading appointments for sharpenerId:', sharpenerId)
      const res = await fetch(`/api/appointments?sharpenerId=${sharpenerId}`)
      const data = await res.json()
      console.log('Appointments response:', data)
      if (res.ok) {
        setAppointments(data.appointments || [])
        console.log('Set appointments:', data.appointments || [])
      } else {
        console.error('Failed to load appointments:', data)
      }
    } catch (err) {
      console.error('Failed to load appointments:', err)
    }
  }

  const handleAppointmentAction = async (appointmentId: number, status: string) => {
    if (!session?.user) return
    
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sharpenerId: session.user.id })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage(`Appointment ${status.toLowerCase()} successfully!`)
        loadAppointments(session.user.id)
      } else {
        setError(data.error || 'Failed to update appointment')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return
    
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/sharpener/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sharpenerId: session.user.id,
          ...locationForm
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Location added successfully!')
        setLocationForm({ locationName: '', streetAddress: '', city: 'Munich', state: 'Bayern', zipCode: '' })
        loadLocations(session.user.id)
      } else {
        setError(data.error || 'Failed to add location')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user || !editingLocation) return
    
    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/sharpener/locations/${editingLocation}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sharpenerId: session.user.id,
          ...locationForm
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Location updated successfully!')
        setEditingLocation(null)
        setLocationForm({ locationName: '', streetAddress: '', city: 'Munich', state: 'Bayern', zipCode: '' })
        loadLocations(session.user.id)
      } else {
        setError(data.error || 'Failed to update location')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleDeleteLocation = async (locationId: number) => {
    if (!session?.user) return
    
    if (!confirm('Are you sure you want to delete this location? This will also delete all associated machines, availabilities, and appointments.')) {
      return
    }

    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/sharpener/locations/${locationId}?sharpenerId=${session.user.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Location deleted successfully!')
        if (selectedLocation === locationId) {
          setSelectedLocation(null)
          setMachines([])
        }
        loadLocations(session.user.id)
      } else {
        setError(data.error || 'Failed to delete location')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const startEditLocation = (location: SharpenerLocation) => {
    setEditingLocation(location.locationId)
    setLocationForm({
      locationName: location.locationName,
      streetAddress: location.streetAddress,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode
    })
  }

  const cancelEditLocation = () => {
    setEditingLocation(null)
    setLocationForm({ locationName: '', streetAddress: '', city: 'Munich', state: 'Bayern', zipCode: '' })
  }

  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLocation) {
      setError('Please select a location first')
      return
    }

    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/sharpener/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: selectedLocation,
          ...machineForm
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Machine added successfully!')
        setMachineForm({ machineType: '', radiusOptions: '' })
        loadMachines(selectedLocation)
      } else {
        setError(data.error || 'Failed to add machine')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleUpdateMachine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user || !editingMachine) return
    
    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/sharpener/machines/${editingMachine}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sharpenerId: session.user.id,
          ...machineForm
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Machine updated successfully!')
        setEditingMachine(null)
        setMachineForm({ machineType: '', radiusOptions: '' })
        if (selectedLocation) {
          loadMachines(selectedLocation)
        }
      } else {
        setError(data.error || 'Failed to update machine')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleDeleteMachine = async (machineId: number) => {
    if (!session?.user) return
    
    if (!confirm('Are you sure you want to delete this machine? This will also delete all associated availabilities and appointments.')) {
      return
    }

    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/sharpener/machines/${machineId}?sharpenerId=${session.user.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Machine deleted successfully!')
        if (selectedLocation) {
          loadMachines(selectedLocation)
        }
      } else {
        setError(data.error || 'Failed to delete machine')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const startEditMachine = (machine: SharpeningMachine) => {
    setEditingMachine(machine.machineId)
    setMachineForm({
      machineType: machine.machineType,
      radiusOptions: machine.radiusOptions
    })
  }

  const cancelEditMachine = () => {
    setEditingMachine(null)
    setMachineForm({ machineType: '', radiusOptions: '' })
  }

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLocation || !selectedMachine) {
      setError('Please select a location and machine first')
      return
    }

    setError('')
    setMessage('')

    try {
      const repeatWeeks = parseInt(availabilityForm.repeatWeeks || '1') || 1
      const baseDate = new Date(availabilityForm.availableDate)
      
      // Create availabilities for each week
      for (let week = 0; week < repeatWeeks; week++) {
        const availableDate = new Date(baseDate)
        availableDate.setDate(availableDate.getDate() + (week * 7))
        
        const res = await fetch('/api/sharpener/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locationId: selectedLocation,
            machineId: selectedMachine,
            availableDate: availableDate.toISOString().split('T')[0],
            startTime: availabilityForm.startTime,
            endTime: availabilityForm.endTime,
            price: availabilityForm.price
          })
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error || `Failed to add availability for week ${week + 1}`)
          return
        }
      }

      setMessage(repeatWeeks > 1 
        ? `Successfully added ${repeatWeeks} weekly availabilities!` 
        : 'Availability added successfully!')
      setAvailabilityForm({ availableDate: '', startTime: '', endTime: '', price: '', repeatWeeks: '1' })
      loadAvailabilities(selectedLocation, selectedMachine)
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleEditAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAvailability) return

    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/sharpener/availability/${editingAvailability}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableDate: availabilityForm.availableDate,
          startTime: availabilityForm.startTime,
          endTime: availabilityForm.endTime,
          price: availabilityForm.price
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Availability updated successfully!')
        setAvailabilityForm({ availableDate: '', startTime: '', endTime: '', price: '', repeatWeeks: '1' })
        setEditingAvailability(null)
        if (selectedLocation && selectedMachine) {
          loadAvailabilities(selectedLocation, selectedMachine)
        }
      } else {
        setError(data.error || 'Failed to update availability')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const handleDeleteAvailability = async (availabilityId: number) => {
    if (!confirm('Are you sure you want to delete this availability?')) {
      return
    }

    setError('')
    setMessage('')

    try {
      const res = await fetch(`/api/sharpener/availability/${availabilityId}`, {
        method: 'DELETE'
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('Availability deleted successfully!')
        if (selectedLocation && selectedMachine) {
          loadAvailabilities(selectedLocation, selectedMachine)
        }
      } else {
        setError(data.error || 'Failed to delete availability')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  const startEditAvailability = (avail: any) => {
    setEditingAvailability(avail.availabilityId)
    setAvailabilityForm({
      availableDate: avail.availableDate.split('T')[0],
      startTime: avail.startTime,
      endTime: avail.endTime,
      price: avail.price.toString(),
      repeatWeeks: '1'
    })
  }

  const cancelEdit = () => {
    setEditingAvailability(null)
    setAvailabilityForm({ availableDate: '', startTime: '', endTime: '', price: '', repeatWeeks: '1' })
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sharpener Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {session?.user?.firstName} {session?.user?.lastName}!</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Appointments
              {appointments.filter(a => a.status === 'PENDING').length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {appointments.filter(a => a.status === 'PENDING').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'locations'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Locations
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'machines'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Machines
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'availability'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Availability
            </button>
          </nav>
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

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Requests</h2>
            
            {/* Pending Appointments */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pending Requests</h3>
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'PENDING').length === 0 ? (
                  <p className="text-gray-500">No pending requests</p>
                ) : (
                  appointments.filter(a => a.status === 'PENDING').map((apt) => (
                    <div key={apt.appointmentId} className="card bg-yellow-50 border-2 border-yellow-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {apt.user?.firstName} {apt.user?.lastName}
                          </h4>
                          <p className="text-gray-700">📞 {apt.user?.phone}</p>
                          <p className="text-gray-700">📧 {apt.user?.email}</p>
                        </div>
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          PENDING
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Date & Time</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(apt.requestedDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-900">{apt.startTime} - {apt.endTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">{apt.location?.locationName}</p>
                          <p className="text-sm text-gray-700">{apt.location?.city}, {apt.location?.state}</p>
                        </div>
                      </div>
                      {apt.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Customer Notes</p>
                          <p className="text-gray-900">{apt.notes}</p>
                        </div>
                      )}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAppointmentAction(apt.appointmentId, 'CONFIRMED')}
                          className="btn-primary flex-1"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(apt.appointmentId, 'DENIED')}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex-1"
                        >
                          ✗ Deny
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Confirmed Appointments */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Confirmed Appointments</h3>
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'CONFIRMED').length === 0 ? (
                  <p className="text-gray-500">No confirmed appointments</p>
                ) : (
                  appointments.filter(a => a.status === 'CONFIRMED').map((apt) => (
                    <div key={apt.appointmentId} className="card bg-green-50 border-2 border-green-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {apt.user?.firstName} {apt.user?.lastName}
                          </h4>
                          <p className="text-gray-700">📞 {apt.user?.phone}</p>
                        </div>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          CONFIRMED
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {new Date(apt.requestedDate).toLocaleDateString()} at {apt.startTime}
                      </p>
                      <p className="text-sm text-gray-700">{apt.location?.locationName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Past Appointments */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Past Appointments</h3>
              <div className="space-y-4">
                {appointments.filter(a => ['COMPLETED', 'RATED', 'DENIED', 'CANCELLED'].includes(a.status)).length === 0 ? (
                  <p className="text-gray-500">No past appointments</p>
                ) : (
                  appointments.filter(a => ['COMPLETED', 'RATED', 'DENIED', 'CANCELLED'].includes(a.status)).map((apt) => (
                    <div key={apt.appointmentId} className="card bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {apt.user?.firstName} {apt.user?.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(apt.requestedDate).toLocaleDateString()} at {apt.startTime}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          apt.status === 'COMPLETED' || apt.status === 'RATED' 
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h2>
              <form onSubmit={editingLocation ? handleUpdateLocation : handleAddLocation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g., Main Shop"
                    value={locationForm.locationName}
                    onChange={(e) => setLocationForm({ ...locationForm, locationName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="123 Main St"
                    value={locationForm.streetAddress}
                    onChange={(e) => setLocationForm({ ...locationForm, streetAddress: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Munich"
                      value={locationForm.city}
                      onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Bayern"
                      value={locationForm.state}
                      onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="80331"
                      value={locationForm.zipCode}
                      onChange={(e) => setLocationForm({ ...locationForm, zipCode: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary flex-1">
                    {editingLocation ? 'Update Location' : 'Add Location'}
                  </button>
                  {editingLocation && (
                    <button 
                      type="button" 
                      onClick={cancelEditLocation}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Locations</h2>
              <div className="space-y-3">
                {locations.length === 0 ? (
                  <p className="text-gray-500">No locations added yet</p>
                ) : (
                  locations.map((loc) => (
                    <div
                      key={loc.locationId}
                      className={`p-4 border rounded-lg transition ${
                        selectedLocation === loc.locationId
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedLocation(loc.locationId)
                          loadMachines(loc.locationId)
                        }}
                      >
                        <h3 className="font-bold text-gray-900">{loc.locationName}</h3>
                        <p className="text-sm text-gray-600">{loc.streetAddress}</p>
                        <p className="text-sm text-gray-600">
                          {loc.city}, {loc.state} {loc.zipCode}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditLocation(loc)
                          }}
                          className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition flex-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteLocation(loc.locationId)
                          }}
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition flex-1"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Machines Tab */}
        {activeTab === 'machines' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingMachine ? 'Edit Machine' : 'Add New Machine'}
              </h2>
              {!selectedLocation ? (
                <p className="text-gray-600">Please select a location first</p>
              ) : (
                <form onSubmit={editingMachine ? handleUpdateMachine : handleAddMachine} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Location
                    </label>
                    <select
                      className="input-field"
                      value={selectedLocation || ''}
                      onChange={(e) => {
                        const locId = parseInt(e.target.value)
                        setSelectedLocation(locId)
                        loadMachines(locId)
                      }}
                    >
                      {locations.map((loc) => (
                        <option key={loc.locationId} value={loc.locationId}>
                          {loc.locationName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Machine Type
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="e.g., Blademaster, Sparx"
                      value={machineForm.machineType}
                      onChange={(e) => setMachineForm({ ...machineForm, machineType: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="1/2, 5/8, 3/4, 7/8, 1"
                      value={machineForm.radiusOptions}
                      onChange={(e) => setMachineForm({ ...machineForm, radiusOptions: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary flex-1">
                      {editingMachine ? 'Update Machine' : 'Add Machine'}
                    </button>
                    {editingMachine && (
                      <button 
                        type="button" 
                        onClick={cancelEditMachine}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Machines</h2>
              <div className="space-y-3">
                {machines.length === 0 ? (
                  <p className="text-gray-500">No machines added yet</p>
                ) : (
                  machines.map((machine) => (
                    <div
                      key={machine.machineId}
                      className={`p-4 border rounded-lg transition ${
                        selectedMachine === machine.machineId
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => setSelectedMachine(machine.machineId)}
                      >
                        <h3 className="font-bold text-gray-900">{machine.machineType}</h3>
                        <p className="text-sm text-gray-600">Radius: {machine.radiusOptions}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditMachine(machine);
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMachine(machine.machineId);
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingAvailability ? 'Edit Availability' : 'Add Availability'}
              </h2>
              {!selectedLocation || !selectedMachine ? (
                <p className="text-gray-600">Please select a location and machine first</p>
              ) : (
                <form onSubmit={editingAvailability ? handleEditAvailability : handleAddAvailability} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      className="input-field"
                      value={selectedLocation || ''}
                      onChange={(e) => {
                        const locId = parseInt(e.target.value)
                        setSelectedLocation(locId)
                        loadMachines(locId)
                        cancelEdit()
                      }}
                      disabled={!!editingAvailability}
                    >
                      {locations.map((loc) => (
                        <option key={loc.locationId} value={loc.locationId}>
                          {loc.locationName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Machine
                    </label>
                    <select
                      className="input-field"
                      value={selectedMachine || ''}
                      onChange={(e) => {
                        setSelectedMachine(parseInt(e.target.value))
                        cancelEdit()
                      }}
                      disabled={!!editingAvailability}
                    >
                      {machines.map((machine) => (
                        <option key={machine.machineId} value={machine.machineId}>
                          {machine.machineType}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={availabilityForm.availableDate}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, availableDate: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        required
                        className="input-field"
                        value={availabilityForm.startTime}
                        onChange={(e) => setAvailabilityForm({ ...availabilityForm, startTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        required
                        className="input-field"
                        value={availabilityForm.endTime}
                        onChange={(e) => setAvailabilityForm({ ...availabilityForm, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="input-field"
                      placeholder="15.00"
                      value={availabilityForm.price}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, price: e.target.value })}
                    />
                  </div>
                  {!editingAvailability && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repeat Weekly (Number of Weeks)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        required
                        className="input-field"
                        placeholder="1"
                        value={availabilityForm.repeatWeeks}
                        onChange={(e) => setAvailabilityForm({ ...availabilityForm, repeatWeeks: e.target.value })}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Creates the same time slot for the next X weeks (e.g., every Monday at 9:00-17:00)
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary flex-1">
                      {editingAvailability ? 'Update Availability' : 'Add Availability'}
                    </button>
                    {editingAvailability && (
                      <button 
                        type="button" 
                        onClick={cancelEdit}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Availabilities</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availabilities.length === 0 ? (
                  <p className="text-gray-500">No availabilities added yet</p>
                ) : (
                  availabilities.map((avail) => (
                    <div
                      key={avail.availabilityId}
                      className={`p-3 border rounded-lg border-green-300 bg-green-50 ${editingAvailability === avail.availabilityId ? 'ring-2 ring-primary-600' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">
                            {new Date(avail.availableDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {avail.startTime} - {avail.endTime}
                          </p>
                          <p className="text-sm text-gray-600">{avail.machine?.machineType}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-600">${avail.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEditAvailability(avail)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition flex-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAvailability(avail.availabilityId)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition flex-1"
                          >
                            Delete
                          </button>
                        </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
