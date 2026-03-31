interface NavItem {
  nome: string
  rota: string
}

export const navegacao: NavItem[] = [
  {
    nome: "Início",
    rota: "/",
  },
  {
    nome: "Destinos",
    rota: "/destinos",
  },
  {
    nome: "Radar",
    rota: "/radar",
  },
  {
    nome: "Milhas",
    rota: "/milhas",
  },
  {
    nome: "Planejamento",
    rota: "/planejamento",
  },
  {
    nome: "Dashboard",
    rota: "/dashboard",
  },
]