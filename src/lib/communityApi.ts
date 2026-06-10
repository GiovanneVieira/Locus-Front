/**
 * Camada de persistência local para as funcionalidades de comunidade do Locus:
 * avaliações, reservas e chat com o anfitrião.
 *
 * As funções têm assinatura assíncrona idêntica às de `@/lib/api`, então
 * trocar esta camada por chamadas HTTP reais (quando o backend expor os
 * endpoints) é só reescrever o corpo de cada função — os hooks e componentes
 * não precisam mudar.
 *
 * Enquanto isso, os dados ficam no `localStorage` do navegador, o que mantém
 * tudo funcional e demonstrável de ponta a ponta (offline-first).
 */

import type {
  Booking,
  BookingStatus,
  ChatMessage,
  ChatThread,
  CreateBookingPayload,
  CreateReviewPayload,
  Review,
  ReviewSummary,
} from "@/lib/types"

const PREFIX = "locus"
const REVIEWS_KEY = "reviews"
const BOOKINGS_KEY = "bookings"
const THREADS_KEY = "chat-threads"

/* ========== Helpers de armazenamento ========== */

function readCollection<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${key}`)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function writeCollection<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value))
  } catch {
    // armazenamento cheio/indisponível — ignora silenciosamente
  }
}

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** Simula a latência de uma chamada de rede para feedbacks de carregamento realistas. */
function settle<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/* ============================================================
   Avaliações
   ============================================================ */

const SEED_AUTHORS = [
  "Mariana Alves",
  "Rafael Pereira",
  "Camila Souza",
  "Thiago Nogueira",
  "Beatriz Lima",
  "Lucas Fernandes",
  "Juliana Castro",
  "Pedro Henrique Dias",
  "Fernanda Rocha",
  "Gabriel Moreira",
  "Larissa Carvalho",
  "André Barbosa",
]

const SEED_COMMENTS = [
  "Lugar impecável e exatamente como nas fotos. O anfitrião respondeu super rápido e foi muito atencioso. Voltaria sem pensar duas vezes!",
  "Localização ótima, perto de tudo. A casa estava limpa e bem equipada. Só achei a cama um pouco dura, mas no geral foi excelente.",
  "Experiência maravilhosa! Ambiente aconchegante, silencioso e com uma vista linda. Recomendo demais para quem busca tranquilidade.",
  "Tudo certo com o check-in e a comunicação. O espaço atende bem, embora algumas fotos pareçam um pouco mais amplas do que o real.",
  "Anfitrião nota mil, sempre disponível. O imóvel é confortável e bem localizado. Ótimo custo-benefício para a região.",
  "Estadia tranquila e sem surpresas. A descrição do anúncio corresponde ao que encontramos. Bairro seguro e bem servido de comércio.",
  "Adoramos! O espaço é ainda melhor pessoalmente, muito bem decorado. O anfitrião deixou dicas ótimas de restaurantes na região.",
  "Bom de forma geral. O Wi-Fi oscilou um pouco e demorei a achar a vaga de garagem, mas nada que atrapalhasse a viagem.",
  "Recebemos boas-vindas calorosas e o apartamento estava limpíssimo. Voltaria com certeza numa próxima visita à cidade.",
  "Custo-benefício excelente para quem fica poucos dias. Cama confortável, chuveiro quente e cozinha completa. Recomendo.",
]

/** Hash determinístico simples para gerar dados de exemplo estáveis por imóvel. */
function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Gera de 2 a 3 avaliações de exemplo, estáveis por imóvel, para que a seção de
 * avaliações e a nota média não apareçam vazias na primeira visita (apoio à
 * demonstração). São sobrescritas/complementadas pelas avaliações reais dos
 * usuários e podem ser limpas esvaziando o localStorage.
 */
// Notas em sua maioria 4–5, com 3 ocasional, para uma média crível (não "tudo 5").
const SEED_RATINGS = [5, 4, 5, 4, 5, 3, 4, 5]

function buildSeedReviews(addressId: string): Review[] {
  const seed = hashString(addressId)
  const count = 2 + (seed % 2) // 2 ou 3
  const now = Date.now()
  const reviews: Review[] = []
  const usedAuthors = new Set<number>()
  const usedComments = new Set<number>()

  for (let i = 0; i < count; i++) {
    // Espalha autores/comentários por imóvel para não repetir as mesmas
    // pessoas em todos os anúncios; evita também duplicar dentro do imóvel.
    let pick = (seed + i * 5) % SEED_AUTHORS.length
    while (usedAuthors.has(pick)) pick = (pick + 1) % SEED_AUTHORS.length
    usedAuthors.add(pick)

    let commentIdx = (seed + i * 3) % SEED_COMMENTS.length
    while (usedComments.has(commentIdx)) commentIdx = (commentIdx + 1) % SEED_COMMENTS.length
    usedComments.add(commentIdx)

    reviews.push({
      id: `seed-${addressId}-${i}`,
      addressId,
      authorId: `seed-author-${pick}`,
      authorName: SEED_AUTHORS[pick],
      authorPfpUrl: null,
      rating: SEED_RATINGS[(seed + i * 2) % SEED_RATINGS.length],
      comment: SEED_COMMENTS[commentIdx],
      createdAt: new Date(now - (i + 1) * 1000 * 60 * 60 * 24 * (3 + i)).toISOString(),
    })
  }

  return reviews
}

function sortByNewest<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function fetchReviews(addressId: string): Promise<Review[]> {
  const all = readCollection<Review>(REVIEWS_KEY)
  let mine = all.filter((review) => review.addressId === addressId)

  if (mine.length === 0) {
    const seeded = buildSeedReviews(addressId)
    if (seeded.length > 0) {
      writeCollection(REVIEWS_KEY, [...all, ...seeded])
      mine = seeded
    }
  }

  return settle(sortByNewest(mine))
}

export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const distribution: ReviewSummary["distribution"] = [0, 0, 0, 0, 0]
  if (reviews.length === 0) {
    return { average: 0, count: 0, distribution }
  }

  let total = 0
  for (const review of reviews) {
    const clamped = Math.min(5, Math.max(1, Math.round(review.rating)))
    total += review.rating
    distribution[clamped - 1] += 1
  }

  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
    distribution,
  }
}

export async function createReview(
  addressId: string,
  author: { id: string; name: string; pfpUrl?: string | null },
  payload: CreateReviewPayload
): Promise<Review> {
  const all = readCollection<Review>(REVIEWS_KEY)
  // Uma avaliação por usuário por imóvel: a nova substitui a anterior.
  const others = all.filter(
    (review) => !(review.addressId === addressId && review.authorId === author.id)
  )

  const review: Review = {
    id: uid(),
    addressId,
    authorId: author.id,
    authorName: author.name,
    authorPfpUrl: author.pfpUrl ?? null,
    rating: Math.min(5, Math.max(1, Math.round(payload.rating))),
    comment: payload.comment.trim(),
    createdAt: new Date().toISOString(),
  }

  writeCollection(REVIEWS_KEY, [...others, review])
  return settle(review)
}

export async function deleteReview(reviewId: string): Promise<void> {
  const all = readCollection<Review>(REVIEWS_KEY)
  writeCollection(
    REVIEWS_KEY,
    all.filter((review) => review.id !== reviewId)
  )
  return settle(undefined)
}

/* ============================================================
   Reservas
   ============================================================ */

function countNights(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00`)
  const end = new Date(`${checkOut}T00:00:00`)
  const diff = end.getTime() - start.getTime()
  if (Number.isNaN(diff) || diff <= 0) return 0
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export interface CreateBookingArgs {
  address: {
    id: string
    title: string
    city?: string | null
    hostId?: string
    hostName?: string | null
    pricePerNight?: number | null
    coverImageId?: string | null
  }
  guest: { id: string; name: string }
  payload: CreateBookingPayload
}

export async function fetchMyBookings(guestId: string): Promise<Booking[]> {
  const all = readCollection<Booking>(BOOKINGS_KEY)
  return settle(sortByNewest(all.filter((booking) => booking.guestId === guestId)))
}

export async function fetchHostBookings(hostId: string): Promise<Booking[]> {
  const all = readCollection<Booking>(BOOKINGS_KEY)
  return settle(sortByNewest(all.filter((booking) => booking.hostId === hostId)))
}

export async function fetchAddressBookings(addressId: string): Promise<Booking[]> {
  const all = readCollection<Booking>(BOOKINGS_KEY)
  return settle(sortByNewest(all.filter((booking) => booking.addressId === addressId)))
}

export async function createBooking({
  address,
  guest,
  payload,
}: CreateBookingArgs): Promise<Booking> {
  const nights = countNights(payload.checkIn, payload.checkOut)
  const pricePerNight = address.pricePerNight ?? 0

  const booking: Booking = {
    id: uid(),
    addressId: address.id,
    addressTitle: address.title,
    addressCity: address.city ?? null,
    coverImageId: address.coverImageId ?? null,
    hostId: address.hostId ?? "",
    hostName: address.hostName ?? null,
    guestId: guest.id,
    guestName: guest.name,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: payload.guests,
    nights,
    pricePerNight,
    totalPrice: nights * pricePerNight,
    status: "PENDING",
    message: payload.message?.trim() || null,
    createdAt: new Date().toISOString(),
  }

  const all = readCollection<Booking>(BOOKINGS_KEY)
  writeCollection(BOOKINGS_KEY, [...all, booking])
  return settle(booking)
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking | undefined> {
  const all = readCollection<Booking>(BOOKINGS_KEY)
  let updated: Booking | undefined
  const next = all.map((booking) => {
    if (booking.id === bookingId) {
      updated = { ...booking, status }
      return updated
    }
    return booking
  })
  writeCollection(BOOKINGS_KEY, next)
  return settle(updated)
}

/* ============================================================
   Chat com o anfitrião
   ============================================================ */

export function buildThreadId(addressId: string, guestId: string): string {
  return `${addressId}:${guestId}`
}

const HOST_GREETINGS = [
  "Olá! Que bom ter você por aqui 👋 Pode me perguntar qualquer coisa sobre a hospedagem que eu te respondo o quanto antes.",
  "Oi! Obrigado pelo interesse no meu espaço. Estou à disposição para tirar suas dúvidas sobre datas, check-in e a região.",
]

const HOST_REPLIES = [
  "Perfeito, anotado! Vou confirmar essa informação e já te retorno por aqui.",
  "Boa pergunta! A região é bem tranquila e segura, fica a poucos minutos do centro.",
  "Claro, conseguimos ajustar isso. Me avise as datas exatas que eu verifico a disponibilidade.",
  "Com certeza! O check-in é flexível, combinamos o melhor horário para você.",
]

function getThreads(): ChatThread[] {
  return readCollection<ChatThread>(THREADS_KEY)
}

function saveThread(thread: ChatThread) {
  const all = getThreads()
  const exists = all.some((item) => item.id === thread.id)
  const next = exists
    ? all.map((item) => (item.id === thread.id ? thread : item))
    : [...all, thread]
  writeCollection(THREADS_KEY, next)
}

export interface OpenThreadArgs {
  addressId: string
  addressTitle: string
  hostId: string
  hostName?: string | null
  guest: { id: string; name: string }
}

/** Recupera o thread guest↔anfitrião ou cria um novo com a saudação do anfitrião. */
export async function openThread({
  addressId,
  addressTitle,
  hostId,
  hostName,
  guest,
}: OpenThreadArgs): Promise<ChatThread> {
  const id = buildThreadId(addressId, guest.id)
  const existing = getThreads().find((thread) => thread.id === id)
  if (existing) return settle(existing)

  const greeting: ChatMessage = {
    id: uid(),
    senderId: hostId,
    senderName: hostName ?? "Anfitrião",
    fromHost: true,
    text: HOST_GREETINGS[hashString(id) % HOST_GREETINGS.length],
    createdAt: new Date().toISOString(),
    automated: true,
  }

  const thread: ChatThread = {
    id,
    addressId,
    addressTitle,
    hostId,
    hostName: hostName ?? null,
    guestId: guest.id,
    guestName: guest.name,
    messages: [greeting],
    updatedAt: greeting.createdAt,
  }

  saveThread(thread)
  return settle(thread)
}

export async function fetchMyThreads(guestId: string): Promise<ChatThread[]> {
  const mine = getThreads().filter((thread) => thread.guestId === guestId)
  return settle(
    [...mine].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  )
}

export async function sendMessage(
  threadId: string,
  sender: { id: string; name: string; fromHost: boolean },
  text: string,
  options?: { automated?: boolean }
): Promise<ChatThread> {
  const all = getThreads()
  const thread = all.find((item) => item.id === threadId)
  if (!thread) {
    throw new Error("Conversa não encontrada")
  }

  const message: ChatMessage = {
    id: uid(),
    senderId: sender.id,
    senderName: sender.name,
    fromHost: sender.fromHost,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    automated: options?.automated,
  }

  const updated: ChatThread = {
    ...thread,
    messages: [...thread.messages, message],
    updatedAt: message.createdAt,
  }

  saveThread(updated)
  return settle(updated, 120)
}

/**
 * Resposta automática do anfitrião — apoio à demonstração enquanto não há um
 * canal em tempo real no backend. Escolhe uma resposta canned variando pelo
 * conteúdo já existente no thread.
 */
export async function sendHostAutoReply(threadId: string): Promise<ChatThread> {
  const thread = getThreads().find((item) => item.id === threadId)
  if (!thread) {
    throw new Error("Conversa não encontrada")
  }

  const index = thread.messages.length % HOST_REPLIES.length
  return sendMessage(
    threadId,
    {
      id: thread.hostId,
      name: thread.hostName ?? "Anfitrião",
      fromHost: true,
    },
    HOST_REPLIES[index],
    { automated: true }
  )
}
