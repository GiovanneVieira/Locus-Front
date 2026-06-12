import type {
  ActivateUserPayload,
  Address,
  AddressResponseDTO,
  AddressSearchParams,
  AdminAuditEntry,
  AdminMetrics,
  AdminMetricsPageParams,
  AdminMetricsParams,
  AdminUser,
  AdminUsersSearchParams,
  AuthPayload,
  AuthResponse,
  Booking,
  BookingStatus,
  ChangeUserRolePayload,
  CreateAddressPayload,
  CreateBookingPayload,
  CreateReviewPayload,
  DestinationAIResponse,
  DestinationRequestDTO,
  DestinationResponseDTO,
  DestinationSearchParams,
  ForgotPasswordDTO,
  ImageDetailsResponse,
  OtpResponse,
  PageCriticalFailureMetricResponseDTO,
  PageLoginAccessMetricResponseDTO,
  PagedResponse,
  PexelsSearchResponse,
  RegisterPayload,
  RentableAddressDetailResponse,
  RentableAddressesParams,
  PersonalAddressRequestDTO,
  Review,
  S3UploadResponse,
  SendOtpPayload,
  UpdateAddressPayload,
  UpdateUserPayload,
  UserRequestDTO,
  UserResponseDTO,
  UserSession,
  VerifyOtpPayload,
} from "@/lib/types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function parseErrorMessage(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as Record<string, unknown>
      const message =
        (typeof data.message === "string" && data.message) ||
        (typeof data.error === "string" && data.error) ||
        (typeof data.details === "string" && data.details)

      return message || fallbackMessage
    } catch {
      return fallbackMessage
    }
  }

  try {
    const text = await response.text()
    return text || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

async function tryRefreshToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
  return response.ok
}

async function request<T>(path: string, init?: RequestInit, retryOnUnauthorized = true): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    path !== "/auth/refresh" &&
    path !== "/auth/login" &&
    path !== "/auth/register"
  ) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      return request<T>(path, init, false)
    }
  }

  if (!response.ok) {
    const fallbackMessage = `Falha ao processar ${path}`
    const message = await parseErrorMessage(response, fallbackMessage)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

/* ========== Auth ========== */

export async function login(payload: AuthPayload) {
  return request<AuthResponse>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(payload) },
    false
  )
}

export async function preRegister(payload: RegisterPayload) {
  return request<UserResponseDTO>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    false
  )
}

export async function logout() {
  return request<{ message: string }>("/auth/logout", { method: "POST" }, false)
}

/* ========== OTP ========== */
export async function sendOtp(payload: SendOtpPayload) {
  return request<OtpResponse>("/otp/send", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false) // false desabilita o retryOnUnauthorized para rotas públicas de auth
}

/**
 * Valida se o código inserido pelo usuário corresponde ao enviado por e-mail
 */
export async function validateOtp(payload: VerifyOtpPayload): Promise<OtpResponse> {
  return request<OtpResponse>("/otp/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  }, false)
}

/* ========== User ========== */

export async function fetchCurrentUser() {
  return request<UserSession>("/user/me")
}

export async function fetchUsers() {
  return request<Record<string, unknown>>("/user")
}

export async function fetchUserById(id: string) {
  return request<Record<string, unknown>>(`/user/${id}`)
}

export async function createUser(payload: UserRequestDTO) {
  return request<Record<string, unknown>>("/user", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateUser(id: string, payload: UserRequestDTO) {
  return request<Record<string, unknown>>(`/user/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteUserById(id: string) {
  return request<Record<string, unknown>>(`/user/${id}`, { method: "DELETE" })
}

export async function updateCurrentUser(payload: UpdateUserPayload) {
  return request<UserSession>("/user/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function becomeHost() {
  return request<UserSession>("/user/become-host", { method: "PATCH" })
}

export async function enableUser(payload: ActivateUserPayload) {
  return request<Record<string, unknown>>("/user/enable", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function forgotPassword(payload: ForgotPasswordDTO) {
  return request<ForgotPasswordDTO>("/user/forgot-password", { method: "PATCH", body: JSON.stringify(payload) })
}

/* ========== Addresses (public) ========== */

function buildQueryString(params: Record<string, unknown> | undefined) {
  if (!params) return ""
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          search.append(key, String(item))
        }
      })
      continue
    }
    search.append(key, String(value))
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchAddresses(params?: RentableAddressesParams | AddressSearchParams) {
  const qs = buildQueryString({ page: params?.page, size: params?.size })
  return request<PagedResponse<Address>>(`/address/rentable${qs}`)
}

export async function fetchMyAddresses() {
  return request<Address[]>("/address/rentable/me")
}

export async function fetchAddressByUserId(id: string) {
  return fetchPersonalAddressByUserId(id)
}

export async function fetchPersonalAddressByUserId(id: string) {
  return request<AddressResponseDTO>(`/address/personal/${id}`)
}

export async function fetchRentableAddressById(id: string) {
  return request<RentableAddressDetailResponse>(`/address/rentable/${id}`)
}


export async function createAddress(payload: CreateAddressPayload) {
  return createPersonalAddress(payload as PersonalAddressRequestDTO)
}
export function getRentableAddressImageUrl(imageId: string): string {
  return `${API_BASE_URL}/s3/rentable-address/image/${imageId}/content`
}

export async function createRentableAddress(payload: CreateAddressPayload) {
  return request<Address>("/address/rentable", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function createPersonalAddress(payload: PersonalAddressRequestDTO) {
  return request<AddressResponseDTO>("/address/personal", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateRentableAddress(id: string, payload: UpdateAddressPayload) {
  return request<Address>(`/address/rentable/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}   

export async function updatePersonalAddress(id: string, payload: UpdateAddressPayload) {
  return request<AddressResponseDTO>(`/address/personal/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}  

export async function deleteRentableAddress(id: string) {
  return request<void>(`/address/rentable/${id}`, { method: "DELETE" })
}

export async function deletePersonalAddress(id: string) {
  return request<void>(`/address/personal/${id}`, { method: "DELETE" })
}

export async function deleteRentableAddressImage(imageId: string) {
  return request<void>(`/s3/rentable-address/image/${imageId}`, { method: "DELETE" })
}

export async function fetchAddressComments(addressId: string) {
  return request<Record<string, unknown>>(`/address/rentable/comment/${addressId}`)
}

export async function createAddressComment(payload: { addressId: string; comment: string; userId: string }) {
  return request<Record<string, unknown>>("/address/rentable/comment", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

/* ========== Upload de imagens (S3) ========== */

/**
 * Faz upload de múltiplas imagens via /s3/upload/multiple e retorna as URLs públicas.
 * Suporta o backend retornando { urls: [...] } OU array direto.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return []

  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))

  const response = await fetch(`${API_BASE_URL}/s3/upload/multiple`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, "Falha ao enviar imagens")
    throw new ApiError(message, response.status)
  }

  const data = (await response.json()) as { urls?: string[] } | string[]
  if (Array.isArray(data)) return data
  return data.urls ?? []
}

function looksLikeFileReference(value: string): boolean {
  if (!value || !value.trim()) return false
  return !/\s/.test(value.trim())
}

function extractUploadReference(data: S3UploadResponse | string): string {
  if (typeof data === "string") {
    return looksLikeFileReference(data) ? data : ""
  }

  if (data.data && typeof data.data === "object") {
    const nested = extractUploadReference(data.data)
    if (nested) return nested
  }

  const candidates: (string | undefined)[] = [
    data.s3Key,
    data.key,
    data.fileName,
    data.filename,
    data.originalName,
    data.fileUrl,
    data.url,
  ]

  for (const candidate of candidates) {
    if (candidate && looksLikeFileReference(candidate)) {
      return candidate
    }
  }

  return ""
}

export async function fetchS3FileUrl(fileName: string) {
  const qs = buildQueryString({ fileName })
  const data = await request<S3UploadResponse | string>(`/s3/get/file-url${qs}`)
  return extractUploadReference(data)
}

export async function uploadProfileImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/s3/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, "Falha ao enviar foto de perfil")
    throw new ApiError(message, response.status)
  }

  const text = await response.text()
  let parsed: unknown = undefined
  if (text) {
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = text
    }
  }

  const data: S3UploadResponse | string =
    typeof parsed === "object" && parsed !== null
      ? (parsed as S3UploadResponse)
      : typeof parsed === "string"
        ? parsed
        : ""

  const reference = extractUploadReference(data)

  if (!reference) {
    throw new ApiError("Upload concluído, mas o servidor não retornou a referência do arquivo.", 0)
  }

  if (/^https?:\/\//.test(reference)) {
    return reference
  }

  return await fetchS3FileUrl(reference)
}

export async function uploadRentableAddressImages(files: File[]): Promise<ImageDetailsResponse[]> {
  if (files.length === 0) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  // Rota limpa, sem query parameters expostos
  const response = await fetch(`${API_BASE_URL}/s3/rentable-address/image/upload`, {
    method: "POST",
    credentials: "include", // Garante o envio de cookies/tokens se houver
    body: formData,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response, "Falha ao enviar imagens");
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as ImageDetailsResponse[];
}

/* ========== Admin ========== */

export async function fetchAdminMetrics(params?: AdminMetricsParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<AdminMetrics>(`/admin/metrics${qs}`)
}

export async function fetchAdminCriticalFailures(params?: AdminMetricsPageParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PageCriticalFailureMetricResponseDTO>(`/admin/metrics/critical-failures${qs}`)
}

export async function fetchAdminAccessLogs(params?: AdminMetricsPageParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PageLoginAccessMetricResponseDTO>(`/admin/metrics/access-logs${qs}`)
}

export async function fetchAdminUsers(params?: AdminUsersSearchParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<AdminUser>>(`/admin/users${qs}`)
}

export async function changeUserRole(id: string, payload: ChangeUserRolePayload) {
  return request<AdminUser>(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(id: string) {
  return request<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" })
}

export async function blockUser(id: string) {
  return request<AdminUser>(`/admin/users/${id}/block`, { method: "POST" })
}

export async function unblockUser(id: string) {
  return request<AdminUser>(`/admin/users/${id}/unblock`, { method: "POST" })
}

export async function fetchAdminAddresses(params?: AddressSearchParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<Address>>(`/admin/addresses${qs}`)
}

export async function deleteAddressAsAdmin(id: string) {
  return request<{ message: string }>(`/admin/addresses/${id}`, { method: "DELETE" })
}

export async function fetchAdminAudit(params?: { page?: number; size?: number }) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<AdminAuditEntry>>(`/admin/audit${qs}`)
}

/* ========== Avaliações (reviews/ratings) ========== */

export async function fetchReviews(addressId: string) {
  return request<Review[]>(`/address/rentable/rating/${addressId}`)
}

export async function createReview(addressId: string, payload: CreateReviewPayload) {
  return request<Review>(`/address/rentable/rating/${addressId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function deleteReview(reviewId: string) {
  return request<void>(`/reviews/${reviewId}`, { method: "DELETE" })
}

export async function fetchAverageRating(addressId: string) {
  return request<{ ratingValue: number }>(`/address/rentable/rating/avg/${addressId}`)
}

/* ========== Reservas (rentals) ========== */

export async function fetchMyBookings() {
  return request<Booking[]>("/rentals/me")
}

export async function fetchHostBookings() {
  return request<Booking[]>("/rentals/host")
}

export async function createBooking(addressId: string, payload: CreateBookingPayload) {
  return request<Booking>(`/rentals/address/${addressId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  return request<Booking>(`/rentals/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

/* ========== Destinations ========== */

export async function fetchDestinations(params?: DestinationSearchParams) {
  const qs = buildQueryString({ page: params?.page, size: params?.size, city: params?.city })
  return request<PagedResponse<DestinationResponseDTO>>(`/destinations${qs}`)
}

export async function fetchDestinationById(id: string) {
  return request<DestinationResponseDTO>(`/destinations/${id}`)
}

export async function fetchDestinationByCity(city: string) {
  return request<DestinationResponseDTO>(`/destinations/city/${encodeURIComponent(city)}`)
}

export async function createDestination(payload: DestinationRequestDTO) {
  return request<DestinationResponseDTO>("/destinations", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateDestination(id: string, payload: DestinationRequestDTO) {
  return request<DestinationResponseDTO>(`/destinations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export async function deleteDestination(id: string) {
  return request<void>(`/destinations/${id}`, { method: "DELETE" })
}

export async function fetchDestinationRecommendations(city: string) {
  const qs = buildQueryString({ city })
  return request<DestinationAIResponse>(`/ai/destinations/recommendations${qs}`)
}

/* ========== Pexels ========== */

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY ?? ""

export async function fetchPexelsImages(query: string, perPage = 4): Promise<PexelsSearchResponse> {
  if (!PEXELS_API_KEY) {
    return { total_results: 0, page: 1, per_page: perPage, photos: [] }
  }

  const params = new URLSearchParams({ query, per_page: String(perPage) })
  const response = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
    headers: { Authorization: PEXELS_API_KEY },
  })

  if (!response.ok) {
    return { total_results: 0, page: 1, per_page: perPage, photos: [] }
  }

  return response.json() as Promise<PexelsSearchResponse>
}

