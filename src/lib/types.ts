import type { LucideProps } from "lucide-react"
import type { ForwardRefExoticComponent, RefAttributes } from "react"

export type LucideIconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>

/* =========================
  Destinations (OpenAPI)
  ========================= */

export interface DestinationRequestDTO {
  city: string
  country: string
}

export interface TouristPointResponseDTO {
  id: string
  name: string
  description: string
  category: string
}

export interface DestinationResponseDTO {
  id: string
  country: string
  city: string
  touristPoints: TouristPointResponseDTO[]
}

export interface DestinationSearchParams {
  city?: string
  page?: number
  size?: number
}

export interface TouristPointDTO {
  nome: string
  descricao: string
  categoria: string
}

export interface DestinationAIResponse {
  destino: string
  pais: string
  pontosTuristicos: TouristPointDTO[]
}

/* =========================
  Pexels
  ========================= */

export interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  alt: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
}

export interface PexelsSearchResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
}

/* =========================
  Duffel Flights
  ========================= */

export interface DuffelPlaceSuggestion {
  id: string
  name: string
  iata_code: string | null
  iata_city_code?: string | null
  city_name?: string | null
  country_name?: string | null
  type?: "airport" | "city" | string
  airports?: DuffelPlaceSuggestion[] | null
  city?: DuffelPlaceSuggestion | null
}

export interface DuffelPlaceSuggestionsResponse {
  data: DuffelPlaceSuggestion[]
}

export interface DuffelAirlineOwner {
  id?: string
  name: string
}

export interface DuffelAirportInfo {
  iata_code?: string | null
  name?: string | null
  city_name?: string | null
}

export interface DuffelFlightSegment {
  id: string
  departing_at: string
  arriving_at: string
  duration?: string | null
  origin: DuffelAirportInfo
  destination: DuffelAirportInfo
}

export interface DuffelFlightSlice {
  id: string
  duration?: string | null
  segments: DuffelFlightSegment[]
}

export interface DuffelFlightOffer {
  id: string
  owner: DuffelAirlineOwner
  total_amount: string
  total_currency: string
  slices: DuffelFlightSlice[]
}

export interface DuffelOfferRequestResponse {
  data: {
    offers?: DuffelFlightOffer[]
  }
}

export interface Indicator {
  titulo: string
  valor: string
  descricao: string
  icone: LucideIconType
}

export interface Differential {
  titulo: string
  descricao: string
  icone: LucideIconType
}

export interface Step {
  etapa: string
  descricao: string
}

export interface Insight {
  titulo: string
  valor: string
  descricao: string
  icone?: LucideIconType
}

export interface LoyaltyProgram {
  nome: string
  saldo: string
  progresso: number
}

export interface Comparison {
  label: string
  value: string
}

export interface PlanningDay {
  titulo: string
  descricao: string
}

export interface AuthPayload {
  email: string
  password: string
}

export interface RegisterPayload extends AuthPayload {
  name: string
}

export interface AuthResponse {
  email: string
  accessToken: string
}

export type UserRole = "ROLE_USER" | "ROLE_HOST" | "ROLE_ADMIN" | "COMMON" | "HOST" | "ADMIN"

export interface UserRequestDTO {
  name?: string
  email?: string
  password?: string
  phone?: string | null
  bio?: string | null
  pfpUrl?: string | null
}

export interface UserResponseDTO {
  id: string
  name: string
  email: string
  role: UserRole | string
  createdAt: string
  updatedAt: string | null
  pfpUrl?: string | null
}

export interface UserSession extends UserResponseDTO {
  phone?: string | null
  bio?: string | null
  host?: boolean
}

export interface UpdateUserPayload {
  name: string
  phone: string | null
  bio: string | null
  pfpUrl: string | null
}

export interface ForgotPasswordDTO{
  email: string
  otpToken: string
  password: string
}

export type ActivateUserDTO = ActivateUserPayload

export interface ActivateUserPayload{
  email: string
}

export interface AddressResponseDTO {
  id: string
  street: string
  houseNumber: string
  neighborhood: string
  city: string
  state: string
  country: string
  cep: string
  isRentable: boolean
}

export interface Address extends AddressResponseDTO {
  title: string
  description?: string | null
  complement?: string | null
  latitude?: number | null
  longitude?: number | null
  pricePerNight?: number | null
  maxGuests?: number | null
  coverImageUrl?: string | null
  images?: RentableAddressImageResponse[]
  imageUrls?: string[]
  amenities?: string[]
  availableFrom?: string | null
  availableTo?: string | null
  hostId: string
  hostName: string
  Name?: string | null
  createdAt: string
  updatedAt: string | null
}

export interface AddressRequestDTO {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  type: string
}

export interface RentableAddressRequestDTO extends AddressRequestDTO {
  type: "RENTABLE" | string
  title: string
  description: string
  pricePerNight: number
  maxGuests: number
  availableFrom: string
  availableTo: string
  imageIds: string[]
  mainImageId: string
  complement?: string | null
  amenities?: string[]
  latitude?: number | null
  longitude?: number | null
}

export interface PersonalAddressRequestDTO extends AddressRequestDTO {
  type: "PERSONAL" | string
  addressName?: string
}

export interface CreateAddressPayload {
  title: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  type: "PERSONAL" | "RENTABLE"
  imageIds: string[]
  mainImageId?: string

  description?: string | null
  complement?: string | null
  pricePerNight?: number | null
  maxGuests?: number | null
  amenities?: string[]
  availableFrom?: string | null
  availableTo?: string | null
  latitude?: number | null
  longitude?: number | null

}

export interface RentableAddressImageResponse {
  id: string
  originalName: string
  s3Key: string
  contentType: string
  fileSize: number
  main: boolean
}

export interface RentableAddressDetailResponse {
  id: string
  title: string
  description: string | null
  street: string
  houseNumber: string // Mapeado como String no seu BaseAddressTypeMapper
  neighborhood: string
  city: string
  state: string
  country: string
  cep: string         // O seu Value Object CEP serializado como String
  pricePerNight: number | null
  maxGuests: number | null
  amenities: string[]
  availableFrom: string | null
  availableTo: string | null
  createdAt: string
  hostId?: string
  complement?: string
  hostName?: string
  images: RentableAddressImageResponse[]
  latitude?: number
  longitude?: number
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>

export interface RentableAddressesParams {
  page?: number
  size?: number
}

export interface AddressSearchParams extends RentableAddressesParams {
  query?: string
  city?: string
  state?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

export interface ImageDetailsResponse {
  id: string; //
  originalName: string;
  s3Key: string;
}

export interface S3UploadResponse {
  url?: string
  fileUrl?: string
  fileName?: string
  filename?: string
  key?: string
  s3Key?: string
  message?: string
  originalName?: string
  id?: string
  data?: S3UploadResponse
}

export interface PagedResponse<T> {
  content: T[]
  page?: number
  number?: number
  size: number
  totalElements: number
  totalPages: number
  first?: boolean
  last?: boolean
  numberOfElements?: number
  empty?: boolean
  pageable?: PageableObject
  sort?: SortObject[]
}

export interface PageableObject {
  paged: boolean
  pageNumber: number
  pageSize: number
  offset: number
  sort: SortObject[]
  unpaged: boolean
}

export interface SortObject {
  direction: string
  nullHandling: string
  ascending: boolean
  property: string
  ignoreCase: boolean
}

/* =========================
            OTP
  ========================= */
export interface SendOtpPayload {
  email: string
  username: string
}

export interface VerifyOtpPayload {
  otpCode: string
  email: string
}

export interface OtpResponse {
  message: string
  otpToken: string
}

/* =========================
   Admin
   ========================= */

export type AdminMetricsGranularity = "day" | "week" | "month" | string

export interface AdminMetricsParams {
  start?: string
  end?: string
  granularity?: AdminMetricsGranularity
}

export interface AdminMetricsPageParams {
  start?: string
  end?: string
  page?: number
  size?: number
  sort?: string[]
}

export interface MetricCountDTO {
  label: string
  total: number
}

export interface TimeBucketMetricDTO {
  bucket: string
  total: number
}

export interface UserAcquisitionMetricsDTO {
  newUsersDaily: number
  newUsersWeekly: number
  newUsersMonthly: number
  activatedUsersInRange: number
  registrationSeries: TimeBucketMetricDTO[]
}

export interface AccessPlatformMetricsDTO {
  successfulLogins: number
  failedLogins: number
  deviceDistribution: MetricCountDTO[]
  operatingSystemDistribution: MetricCountDTO[]
}

export interface RentalConversionMetricsDTO {
  createdRentals: number
  confirmedRentals: number
  conversionRate: number
}

export interface StorageUploadMetricsDTO {
  uploadedImages: number
  totalBytes: number
  averageBytes: number
}

export interface CriticalFailureMetricsDTO {
  totalFailures: number
  failuresByType: MetricCountDTO[]
}

export interface AdminMetricsOverviewDTO {
  start: string
  end: string
  users: UserAcquisitionMetricsDTO
  accessPlatforms: AccessPlatformMetricsDTO
  rentals: RentalConversionMetricsDTO
  storageUploads: StorageUploadMetricsDTO
  criticalFailures: CriticalFailureMetricsDTO
}

export type AdminMetrics = AdminMetricsOverviewDTO

export type CriticalFailureType =
  | "LOGIN_INVALID"
  | "OTP_EXPIRED"
  | "OTP_INVALID"
  | "OTP_TOKEN_INVALID"

export interface CriticalFailureMetricResponseDTO {
  id: string
  email: string
  failureType: CriticalFailureType
  reason: string
  occurredAt: string
}

export type DeviceType = "MOBILE" | "WEB" | "UNKNOWN"

export interface LoginAccessMetricResponseDTO {
  id: string
  userId: string
  email: string
  success: boolean
  reason: string
  deviceType: DeviceType
  operatingSystem: string
  occurredAt: string
}

export type PageCriticalFailureMetricResponseDTO = PagedResponse<CriticalFailureMetricResponseDTO>

export type PageLoginAccessMetricResponseDTO = PagedResponse<LoginAccessMetricResponseDTO>

export interface AdminUser extends UserSession {
  blocked?: boolean
  addressCount?: number
  lastLoginAt?: string | null
}

export interface AdminUsersSearchParams {
  query?: string
  role?: UserRole | string
  page?: number
  size?: number
}

export interface ChangeUserRolePayload {
  role: UserRole | string
}

export interface AdminAuditEntry {
  id: string
  actorId: string | null
  actorName: string | null
  action: string
  targetType: string
  targetId?: string | null
  description?: string | null
  createdAt: string
}

/* =========================
   Avaliações (reviews)
   ========================= */

export interface Review {
  id: string
  addressId: string
  authorId: string
  authorName: string
  authorPfpUrl?: string | null
  rating: number // 1 a 5
  comment: string
  createdAt: string
}

export interface CreateReviewPayload {
  rating: number
  comment: string
}

export interface ReviewSummary {
  average: number
  count: number
  /** Quantidade de avaliações por nota, índice 0 = 1 estrela … índice 4 = 5 estrelas. */
  distribution: [number, number, number, number, number]
}

/* =========================
   Reservas (bookings)
   ========================= */

export type BookingStatus = "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED"

export interface Booking {
  id: string
  addressId: string
  addressTitle: string
  addressCity?: string | null
  coverImageId?: string | null
  hostId: string
  hostName?: string | null
  guestId: string
  guestName: string
  checkIn: string // ISO (yyyy-mm-dd)
  checkOut: string // ISO (yyyy-mm-dd)
  guests: number
  nights: number
  pricePerNight: number
  totalPrice: number
  status: BookingStatus
  message?: string | null
  createdAt: string
}

export interface CreateBookingPayload {
  checkIn: string
  checkOut: string
  guests: number
  message?: string
}

/* =========================
   Chat com o anfitrião
   ========================= */

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  fromHost: boolean
  text: string
  createdAt: string
  /** Resposta gerada automaticamente para fins de demonstração. */
  automated?: boolean
}

export interface ChatThread {
  id: string // `${addressId}:${guestId}`
  addressId: string
  addressTitle: string
  hostId: string
  hostName?: string | null
  guestId: string
  guestName: string
  messages: ChatMessage[]
  updatedAt: string
}
