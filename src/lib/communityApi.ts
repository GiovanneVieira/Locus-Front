/**
 * Camada local de apoio para funcionalidades de comunidade ainda não cobertas
 * pelo backend.
 *
 * Avaliações e reservas já são servidas pela API real (ver `@/lib/api`).
 * Aqui permanece apenas:
 *  - o chat com o anfitrião (persistido no `localStorage`, com resposta
 *    automática simulada enquanto não há um canal em tempo real no backend);
 *  - `summarizeReviews`, função pura que agrega as avaliações vindas da API.
 */

import type { ChatMessage, ChatThread, Review, ReviewSummary } from "@/lib/types"

const PREFIX = "locus"
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

/** Hash determinístico simples (usado para variar a saudação do anfitrião). */
function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/* ============================================================
   Avaliações — agregação (dados vêm da API real)
   ============================================================ */

export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const distribution: ReviewSummary["distribution"] = [0, 0, 0, 0, 0]
  const validReviews = reviews.filter((review) => Number.isFinite(review.rating))

  if (validReviews.length === 0) {
    return { average: 0, count: 0, distribution }
  }

  let total = 0
  for (const review of validReviews) {
    const clamped = Math.min(5, Math.max(1, Math.round(review.rating)))
    total += review.rating
    distribution[clamped - 1] += 1
  }

  return {
    average: Math.round((total / validReviews.length) * 10) / 10,
    count: validReviews.length,
    distribution,
  }
}

/* ============================================================
   Chat com o anfitrião (local + resposta simulada)
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
  return settle([...mine].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
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
