import { useCallback, useEffect, useRef, useState } from "react"
import { ImagePlus, Star, Trash2 } from "lucide-react"

const MAX_IMAGES = 10
const MAX_SIZE_MB = 5
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export interface UploaderImage {
  /** URL local (blob:) ou URL pública já no S3 */
  url: string
  /** Arquivo cru, presente apenas para imagens ainda não enviadas */
  file?: File
  /** True quando a URL é uma imagem já hospedada (S3) */
  remote?: boolean
}

interface ImageUploaderProps {
  images: UploaderImage[]
  onChange: (images: UploaderImage[]) => void
  /** Máximo de imagens (default 10) */
  max?: number
  /** Mensagem de erro vinda de fora (ex.: upload falhou) */
  externalError?: string | null
}

/**
 * Uploader de imagens com:
 * - Drag and drop
 * - Preview
 * - Reordenação (primeira é a "capa")
 * - Limite de tamanho e quantidade
 * - Mensagens claras (Nielsen #9, recuperação de erros)
 */
export function ImageUploader({
  images,
  onChange,
  max = MAX_IMAGES,
  externalError,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  // Limpa as URLs blob criadas localmente quando o componente sai do DOM.
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (!img.remote && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null)
      const incoming = Array.from(files)

      const valid: File[] = []
      for (const file of incoming) {
        if (!ACCEPTED.includes(file.type.toLowerCase())) {
          setError(`Formato não suportado: ${file.name}. Use JPG, PNG ou WEBP.`)
          continue
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`A imagem "${file.name}" passa de ${MAX_SIZE_MB} MB.`)
          continue
        }
        valid.push(file)
      }

      if (valid.length === 0) return

      const remaining = max - images.length
      if (remaining <= 0) {
        setError(`Limite de ${max} imagens atingido.`)
        return
      }

      const toAdd = valid.slice(0, remaining).map<UploaderImage>((file) => ({
        url: URL.createObjectURL(file),
        file,
      }))

      onChange([...images, ...toAdd])

      if (valid.length > remaining) {
        setError(`Apenas as ${remaining} primeiras foram adicionadas (limite ${max}).`)
      }
    },
    [images, max, onChange]
  )

  function removeAt(index: number) {
    const target = images[index]
    if (target && !target.remote && target.url.startsWith("blob:")) {
      URL.revokeObjectURL(target.url)
    }
    onChange(images.filter((_, i) => i !== index))
  }

  function moveToCover(index: number) {
    if (index === 0) return
    const next = [...images]
    const [picked] = next.splice(index, 1)
    next.unshift(picked)
    onChange(next)
  }

  const displayError = error ?? externalError

  return (
    <div className="flex flex-col gap-3">
      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (event.dataTransfer.files.length > 0) {
            handleFiles(event.dataTransfer.files)
          }
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
        }`}
        aria-label="Adicionar imagens do imóvel"
      >
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ImagePlus size={20} />
        </span>
        <span className="text-sm font-semibold text-foreground">
          Clique ou arraste imagens
        </span>
        <span className="text-xs text-muted-foreground">
          JPG, PNG ou WEBP · até {MAX_SIZE_MB} MB · até {max} imagens
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="sr-only"
        onChange={(event) => {
          if (event.target.files) {
            handleFiles(event.target.files)
            event.target.value = "" // permite re-selecionar o mesmo arquivo
          }
        }}
      />

      {displayError ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {displayError}
        </p>
      ) : null}

      {/* Grid de previews */}
      {images.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-card"
            >
              <img
                src={image.url}
                alt={`Imagem ${index + 1}`}
                className="size-full object-cover transition group-hover:scale-105"
              />
              {/* Selo de capa */}
              {index === 0 ? (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-semibold text-background backdrop-blur">
                  <Star size={9} fill="currentColor" /> capa
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => moveToCover(index)}
                  className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-0.5 text-[10px] font-semibold text-foreground opacity-0 transition group-hover:opacity-100"
                  title="Definir como capa"
                >
                  <Star size={9} /> capa
                </button>
              )}
              {/* Botão de remover */}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-card/95 text-destructive opacity-0 transition group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                title="Remover imagem"
                aria-label={`Remover imagem ${index + 1}`}
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default ImageUploader
