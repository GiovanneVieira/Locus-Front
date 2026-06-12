import { useState } from "react"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCreateDestination } from "@/hooks/useDestinations"

export function CreateDestinationModal({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const { mutate: create, isPending } = useCreateDestination()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim() || !country.trim()) return
    create(
      { city: city.trim(), country: country.trim() },
      {
        onSuccess: () => {
          setCity("")
          setCountry("")
          setOpen(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`rounded-full ${className ?? ""}`}>
          <Plus size={16} className="mr-1.5" />
          Novo destino
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar destino</DialogTitle>
          <DialogDescription>
            Adicione um novo destino ao catálogo. Após a criação, a IA gerará os pontos turísticos automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="dest-city" className="text-sm font-medium">
              Cidade
            </label>
            <input
              id="dest-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Paris"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="dest-country" className="text-sm font-medium">
              País
            </label>
            <input
              id="dest-country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ex: França"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !city.trim() || !country.trim()}>
              {isPending ? "Criando..." : "Criar destino"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}