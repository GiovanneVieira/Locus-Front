import {
  AlertTriangle,
  ArrowDownToLine,
  BookOpen,
  Compass,
  Eye,
  Gauge,
  HelpCircle,
  Keyboard,
  Lightbulb,
  ListFilter,
  MessageCircleQuestion,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Undo2,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import HeuristicCard from "@/components/HeuristicCard"

const heuristics = [
  {
    number: 1,
    title: "Visibilidade do status do sistema",
    description:
      "O usuário sempre precisa saber o que está acontecendo, em tempo real e com confirmação clara.",
    example:
      "Toasts globais para cada ação (publicar, remover, salvar). Spinners nos botões durante requisições. Card de pré-visualização ao vivo no formulário de novo endereço. Breadcrumbs em cada página interna indicando o caminho.",
    Icon: Eye,
  },
  {
    number: 2,
    title: "Correspondência com o mundo real",
    description:
      "Linguagem familiar do usuário, sem jargão técnico.",
    example:
      "'Anfitrião', 'hóspedes', 'check-in/check-out', 'amenidades' com ícones (piscina, churrasqueira, Wi-Fi). Todo o app em português, mensagens de erro escritas para humanos.",
    Icon: Compass,
  },
  {
    number: 3,
    title: "Controle e liberdade do usuário",
    description:
      "Saídas de emergência para reverter decisões e sair de onde está.",
    example:
      "Botão Cancelar em todo formulário. Breadcrumbs e link Voltar em todas páginas internas. Diálogo de confirmação ao sair da conta. Toasts podem ser fechados antes do tempo.",
    Icon: Undo2,
  },
  {
    number: 4,
    title: "Consistência e padrões",
    description:
      "Mesmas palavras, ícones e padrões em todo o sistema.",
    example:
      "Biblioteca interna de componentes (FormField, FormSection, Tooltip, ConfirmDialog). Mesmo header em todas as páginas. Tokens de design centralizados em CSS variables. Ícones do Lucide consistentes.",
    Icon: BookOpen,
  },
  {
    number: 5,
    title: "Prevenção de erros",
    description:
      "É melhor evitar o erro acontecer do que tratar depois.",
    example:
      "CEP auto-formata 12345678 → 12345-678. UF aceita só 2 letras maiúsculas. Check-out tem min={check-in}. Diálogo modal de confirmação antes de remover endereço ou sair da conta. Validação onBlur em todos os campos.",
    Icon: ShieldAlert,
  },
  {
    number: 6,
    title: "Reconhecimento, não memorização",
    description:
      "Tudo que o usuário precisa lembrar deve estar visível.",
    example:
      "Tooltips em todos os botões só-ícone. Breadcrumbs mostrando o caminho atual. Ícones identificáveis nas amenidades. Atalhos de teclado documentados no painel (tecla ?).",
    Icon: Lightbulb,
  },
  {
    number: 7,
    title: "Flexibilidade e eficiência",
    description:
      "Iniciante e expert convivem: sem atrapalhar um, acelera o outro.",
    example:
      "Atalho ? abre painel de atalhos. Tecla D alterna tema. / foca na busca. G seguido de letra navega entre páginas (G H = início, G E = Hospedagens, G M = meus Hospedagens). Imagens podem ser arrastadas no uploader.",
    Icon: Keyboard,
  },
  {
    number: 8,
    title: "Design estético e minimalista",
    description:
      "Cada elemento deve ter uma razão de estar na tela.",
    example:
      "Paleta reduzida: um azul confiante + neutros + 1 destrutivo + 1 sucesso. Filtros avançados ficam ocultos até serem pedidos. Hierarquia tipográfica com 2 pesos só (400 e 600). Animações sutis.",
    Icon: Shield,
  },
  {
    number: 9,
    title: "Reconhecer, diagnosticar e recuperar de erros",
    description:
      "Mensagens claras, em linguagem humana, com ações de recuperação.",
    example:
      "Toasts vermelhos com a mensagem específica do backend. Página 404 com 3 saídas (voltar, início, explorar). ErrorBoundary global que substitui a tela quebrada por opção de recarregar. Erros de campo aparecem ao lado do campo.",
    Icon: AlertTriangle,
  },
  {
    number: 10,
    title: "Ajuda e documentação",
    description:
      "Mesmo o app mais simples precisa de ajuda contextual.",
    example:
      "Hints abaixo de cada campo do formulário ('Curto e descritivo. Ex.: Loft moderno…'). Tooltips em ações. Esta própria página documentando as heurísticas. Painel de atalhos (?) acessível a qualquer momento.",
    Icon: HelpCircle,
  },
] as const

const otherPrinciples = [
  {
    title: "Lei de Fitts",
    description:
      "Quanto maior e mais próximo um alvo, mais rápido é alcançá-lo.",
    Icon: Gauge,
    examples: [
      "Botões principais com altura mínima de 44px (h-11 do Tailwind) para garantir área de clique confortável.",
      "Botão 'Publicar endereço' do anfitrião fica próximo do formulário, não em outra tela.",
      "Botão 'Sair' fica no canto do menu (Lei de Fitts implícita: cantos têm tamanho infinito virtual).",
    ],
  },
  {
    title: "Lei de Hick",
    description:
      "Tempo de decisão cresce conforme aumenta o número de opções visíveis.",
    Icon: ListFilter,
    examples: [
      "Menu principal com no máximo 7 itens. Itens secundários (admin, perfil, sair) ficam num menu dropdown.",
      "Filtros avançados de Hospedagens ficam atrás de um botão 'Filtros' — não tomam espaço até serem pedidos.",
      "Amenidades em grupos visuais com ícone — mais rápido escanear do que ler 9 nomes.",
    ],
  },
  {
    title: "Consistência (Lei de Jakob)",
    description:
      "Usuários esperam que seu app funcione como os outros que já conhecem.",
    Icon: RotateCcw,
    examples: [
      "Atalhos seguem convenção: / pra busca (GitHub, YouTube), G+letra pra navegação (Vim, Linear).",
      "Padrão de confirmação destrutiva idêntico ao de apps profissionais.",
      "Tema claro/escuro respeitando padrão do sistema operacional do usuário no primeiro acesso.",
    ],
  },
] as const

export default function HeuristicsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <Breadcrumbs items={[{ label: "Heurísticas" }]} className="mb-5" />

        <header className="mb-10 max-w-3xl">
          <span className="section-badge">
            <MessageCircleQuestion size={12} />
            Qualidade da experiência
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Princípios de usabilidade aplicados no Locus
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            As 10 heurísticas de Jakob Nielsen são princípios consagrados de design de interface.
            Aqui está cada uma delas e como aplicamos no Locus — com referências concretas a
            componentes e fluxos do produto. Também explicamos Fitts, Hick e a Lei de Jakob.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            10 Heurísticas de Nielsen
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {heuristics.map((heuristic) => (
              <HeuristicCard key={heuristic.number} {...heuristic} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <ArrowDownToLine size={14} className="text-primary" />
            Outros princípios complementares
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {otherPrinciples.map((principle) => (
              <article
                key={principle.title}
                className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <header className="flex items-start gap-3">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <principle.Icon size={20} />
                  </span>
                  <h3 className="text-base font-semibold leading-tight">{principle.title}</h3>
                </header>
                <p className="text-sm leading-6 text-muted-foreground">{principle.description}</p>
                <ul className="mt-1 flex flex-col gap-1.5 rounded-xl border border-border bg-secondary/40 p-3">
                  {principle.examples.map((example) => (
                    <li key={example} className="flex items-start gap-2 text-xs leading-5">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <RotateCcw size={20} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <h2 className="text-base font-semibold">Processo contínuo</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Estes princípios são revisados a cada sprint. Quando um novo componente ou fluxo é
                adicionado, a equipe verifica se ele respeita as heurísticas — e ajusta antes de
                subir para produção. Pressione{" "}
                <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-semibold">
                  ?
                </kbd>{" "}
                em qualquer página para ver os atalhos.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
