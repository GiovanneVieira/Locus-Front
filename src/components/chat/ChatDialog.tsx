import { useEffect, useRef, useState } from "react"
import { Loader2, SendHorizonal, Sparkles } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useChatThread, useHostAutoReply, useSendMessage } from "@/hooks/useChat"
import { getInitials } from "@/lib/user"
import { buildThreadId } from "@/lib/communityApi"
import type { ChatMessage, RentableAddressDetailResponse, UserSession } from "@/lib/types"

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address: RentableAddressDetailResponse
  guest: UserSession
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(
      new Date(iso)
    )
  } catch {
    return ""
  }
}

export function ChatDialog({ open, onOpenChange, address, guest }: ChatDialogProps) {
  const hostId = address.hostId ?? ""
  const hostName = address.hostName ?? "Anfitrião"

  const threadArgs =
    open && hostId
      ? {
          addressId: address.id,
          addressTitle: address.title,
          hostId,
          hostName,
          guest: { id: guest.id, name: guest.name },
        }
      : null

  const threadId = buildThreadId(address.id, guest.id)
  const { data: thread, isLoading } = useChatThread(threadArgs)
  const sendMessage = useSendMessage(threadId)
  const autoReply = useHostAutoReply(threadId)

  const [draft, setDraft] = useState("")
  const [hostTyping, setHostTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const replyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const messages = thread?.messages ?? []

  // Rola para a última mensagem sempre que a conversa muda.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, hostTyping])

  // Limpa o timer da resposta automática ao fechar/desmontar.
  useEffect(() => {
    if (!open && replyTimeout.current) {
      clearTimeout(replyTimeout.current)
      replyTimeout.current = null
      setHostTyping(false)
    }
    return () => {
      if (replyTimeout.current) clearTimeout(replyTimeout.current)
    }
  }, [open])

  async function handleSend() {
    const text = draft.trim()
    if (!text || sendMessage.isPending || isLoading || !thread) return
    setDraft("")

    try {
      await sendMessage.mutateAsync({
        sender: { id: guest.id, name: guest.name, fromHost: false },
        text,
      })

      // Simula o anfitrião digitando e respondendo (apoio à demonstração).
      setHostTyping(true)
      replyTimeout.current = setTimeout(async () => {
        try {
          await autoReply.mutateAsync()
        } finally {
          setHostTyping(false)
          replyTimeout.current = null
        }
      }, 1300)
    } catch {
      setDraft(text)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[34rem] max-h-[90vh] max-w-md flex-col gap-0 overflow-hidden rounded-3xl border-border bg-card p-0 sm:max-w-md sm:rounded-3xl">
        <DialogHeader className="flex flex-row items-center gap-3 border-b border-border px-5 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold">
            {getInitials(hostName)}
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-sm font-bold">{hostName}</DialogTitle>
            <DialogDescription className="truncate text-xs text-muted-foreground">
              Anfitrião · {address.title}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Mensagens */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/40 px-4 py-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 size={22} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {hostTyping ? <TypingBubble name={hostName} /> : null}
            </>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border px-3 py-3">
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              void handleSend()
            }}
          >
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend()
                }
              }}
              placeholder="Escreva uma mensagem…"
              rows={1}
              className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0 rounded-2xl"
              disabled={!draft.trim() || sendMessage.isPending || isLoading || !thread}
              aria-label="Enviar mensagem"
            >
              {sendMessage.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <SendHorizonal size={16} />
              )}
            </Button>
          </form>
          <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] text-muted-foreground">
            <Sparkles size={10} /> Respostas do anfitrião simuladas para demonstração
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = !message.fromHost
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-2xs ${
          mine
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-foreground"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
        <span
          className={`mt-1 block text-right text-[10px] ${
            mine ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}

function TypingBubble({ name }: { name: string }) {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
        <span className="sr-only">{name} está digitando</span>
        <span className="flex gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  )
}
