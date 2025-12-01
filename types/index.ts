// User and Authentication Types
export interface User {
  userId: number
  email: string
  firstName: string
  lastName: string
  phone: string
  isEmailVerified: boolean
  createdAt: Date
  accountType: 'user'
}

export interface Sharpener {
  sharpenerId: number
  email: string
  firstName: string
  lastName: string
  phone: string
  bio?: string
  isEmailVerified: boolean
  averageRating?: number
  totalRatings: number
  createdAt: Date
  accountType: 'sharpener'
}

export type AuthUser = User | Sharpener

// Location Types
export interface SharpenerLocation {
  locationId: number
  sharpenerId: number
  locationName: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  isActive: boolean
  createdAt: Date
}

// Machine Types
export interface SharpeningMachine {
  machineId: number
  locationId: number
  machineType: string
  radiusOptions: string
  isActive: boolean
  createdAt: Date
}

// Availability Types
export interface Availability {
  availabilityId: number
  locationId: number
  machineId: number
  availableDate: Date
  startTime: string
  endTime: string
  price: number
  createdAt: Date
  location?: SharpenerLocation
  machine?: SharpeningMachine
}

// Appointment Types
export type AppointmentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'DENIED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'RATED'
  | 'EXPIRED'

export interface Appointment {
  appointmentId: number
  userId: number
  sharpenerId: number
  locationId: number
  machineId: number
  availabilityId: number
  requestedDate: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  user?: User
  sharpener?: Sharpener
  location?: SharpenerLocation
  machine?: SharpeningMachine
  availability?: Availability
  rating?: Rating
}

// Rating Types
export interface Rating {
  ratingId: number
  appointmentId: number
  userId: number
  sharpenerId: number
  rating: number
  comment?: string
  createdAt: Date
  appointment?: Appointment
  user?: User
  sharpener?: Sharpener
}

// Search Types
export interface SearchResult {
  sharpenerId: number
  sharpenerName: string
  averageRating?: number
  totalRatings: number
  locationId: number
  locationName: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  distance: number | null
  machines: SharpeningMachine[]
  upcomingAvailability: Availability[]
}

export interface SearchCoordinates {
  lat: number
  lon: number
}

export interface SearchResponse {
  results: SearchResult[]
  searchCoordinates?: SearchCoordinates
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
  accountType: 'user' | 'sharpener'
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  accountType: 'user' | 'sharpener'
  bio?: string
}

export interface LocationFormData {
  locationName: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
}

export interface MachineFormData {
  machineType: string
  radiusOptions: string
}

export interface AvailabilityFormData {
  availableDate: string
  startTime: string
  endTime: string
  price: string
  repeatWeeks?: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  message?: string
  error?: string
  data?: T
}

export interface LoginResponse {
  message: string
  user: User | Sharpener
}

export interface SearchResponse {
  results: SearchResult[]
  searchCoordinates?: SearchCoordinates
}

export interface AppointmentsResponse {
  appointments: Appointment[]
}
