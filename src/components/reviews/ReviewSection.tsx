import { useState } from "react"
import { Loader2, MessageSquareText, Star, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/reviews/StarRating"
import { useToast } from "@/components/feedback/ToastProvider"
import { useCreateReview, useDeleteReview, useReviews } from "@/hooks/useReviews"
import { ApiError } from "@/lib/api"
import { formatDate, getInitials } from "@/lib/user"
import type { Review, UserSession } from "@/lib/types"

interface ReviewSectionProps {
  addressId: string
  currentUser?: UserSession | null
  isOwner: boolean
}

function formatRating(value: number | null | undefined) {
  return Number.isFinite(value) ? (value as number).toFixed(1) : "0.0"
}

export function ReviewSection({ addressId, currentUser, isOwner }: ReviewSectionProps) {
  const toast = useToast()
  const { data, isLoading } = useReviews(addressId)
  const reviews = data?.reviews ?? []
  const summary = data?.summary

  const author = currentUser
    ? { id: currentUser.id, name: currentUser.name, pfpUrl: currentUser.pfpUrl }
    : null
  const myReview = author ? reviews.find((r) => r.authorId === author.id) : undefined

  const createReview = useCreateReview(addressId)
  const deleteReview = useDeleteReview(addressId)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  // Pré-preenche o formulário quando o usuário já avaliou (modo edição).
  // Ajuste de estado durante a renderização — padrão recomendado pelo React
  // para sincronizar com dados que chegam de forma assíncrona, sem efeitos.
  if (myReview && myReview.id !== editingId) {
    setEditingId(myReview.id)
    setRating(myReview.rating)
    setComment(myReview.comment)
  }

  const canReview = Boolean(author) && !isOwner

  async function handleSubmit() {
    if (rating < 1) {
      toast.error("Escolha uma nota", "Toque nas estrelas para avaliar de 1 a 5.")
      return
    }
    if (comment.trim().length < 4) {
      toast.error("Conte um pouco mais", "Escreva um breve comentário sobre a estadia.")
      return
    }
    try {
      await createReview.mutateAsync({ rating, comment })
      toast.success(
        myReview ? "Avaliação atualizada" : "Avaliação publicada",
        "Obrigado por compartilhar sua experiência!"
      )
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Não foi possível salvar agora."
      toast.error("Falha ao avaliar", message)
    }
  }

  async function handleDelete(review: Review) {
    try {
      await deleteReview.mutateAsync(review.id)
      setEditingId(null)
      setRating(0)
      setComment("")
      toast.info("Avaliação removida")
    } catch {
      toast.error("Falha ao remover", "Tente novamente em instantes.")
    }
  }

  return (
    <article id="avaliacoes">
      <h2 className="flex items-center gap-2 border-b border-border pb-3 text-xl font-bold tracking-tight text-foreground">
        <Star size={18} className="fill-amber-400 text-amber-400" />
        Avaliações
        {summary && summary.count > 0 ? (
          <span className="text-sm font-medium text-muted-foreground">
            · {formatRating(summary.average)} ({summary.count})
          </span>
        ) : null}
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 size={22} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {/* Resumo: média + distribuição */}
          {summary && summary.count > 0 ? (
            <div className="grid gap-5 rounded-2xl border border-border bg-card/60 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex flex-col items-center justify-center gap-1 sm:pr-6 sm:border-r sm:border-border">
                <span className="text-4xl font-bold tracking-tight">
                  {formatRating(summary.average)}
                </span>
                <StarRating value={summary.average} size={15} />
                <span className="text-xs text-muted-foreground">
                  {summary.count} {summary.count === 1 ? "avaliação" : "avaliações"}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const qty = summary.distribution[star - 1]
                  const pct = summary.count > 0 ? (qty / summary.count) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right font-medium text-muted-foreground">{star}</span>
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-5 text-right tabular-nums text-muted-foreground">{qty}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          {/* Formulário de avaliação */}
          {canReview ? (
            <div className="rounded-2xl border border-border bg-card/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {myReview ? "Editar sua avaliação" : "Avalie esta hospedagem"}
                </h3>
                <StarRating value={rating} onChange={setRating} size={22} />
              </div>
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Como foi sua experiência? Conte sobre o espaço, a localização e o anfitrião…"
                rows={3}
                maxLength={600}
                className="mt-4"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">{comment.length}/600</span>
                <Button
                  className="h-10 gap-2 rounded-xl px-5 font-semibold"
                  onClick={handleSubmit}
                  disabled={createReview.isPending}
                >
                  {createReview.isPending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <MessageSquareText size={15} />
                  )}
                  {myReview ? "Atualizar avaliação" : "Publicar avaliação"}
                </Button>
              </div>
            </div>
          ) : isOwner ? (
            <p className="rounded-2xl border border-dashed border-border bg-secondary/20 px-4 py-3 text-xs text-muted-foreground">
              Você é o anfitrião deste imóvel — as avaliações são feitas pelos hóspedes.
            </p>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-secondary/20 px-4 py-3 text-xs text-muted-foreground">
              Entre na sua conta para avaliar esta hospedagem.
            </p>
          )}

          {/* Lista de avaliações */}
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">
              <MessageSquareText size={26} className="stroke-[1.5]" />
              <p className="text-sm font-medium">Ainda não há avaliações</p>
              <p className="text-xs">Seja o primeiro a compartilhar sua experiência.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {reviews.map((review) => {
                const isMine = author?.id === review.authorId
                return (
                  <li
                    key={review.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      {review.authorPfpUrl ? (
                        <img
                          src={review.authorPfpUrl}
                          alt={review.authorName}
                          className="size-9 shrink-0 rounded-full border border-border object-cover"
                        />
                      ) : (
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-semibold">
                          {getInitials(review.authorName)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {review.authorName}
                              {isMine ? (
                                <span className="ml-2 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                  Você
                                </span>
                              ) : null}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <StarRating value={review.rating} size={13} />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                      {isMine ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(review)}
                          disabled={deleteReview.isPending}
                          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                          aria-label="Remover minha avaliação"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </article>
  )
}
