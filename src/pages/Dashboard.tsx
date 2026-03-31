import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import {
  CheckCircle2,
  ClipboardList,
  LoaderCircle,
  LogOut,
  Plus,
  Signal,
  Trash2,
  UserCircle2,
  Workflow,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import {
  ApiError,
  createTask,
  deleteTask,
  fetchBoard,
  fetchCurrentUser,
  logout,
  updateTask,
} from "@/lib/api"
import type {
  Board,
  BoardColumn,
  BoardTask,
  CreateTaskPayload,
  TaskColumnCode,
  TaskPriority,
  UserSession,
} from "@/lib/types"

const priorityLabel: Record<TaskPriority, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
}

const columnTone: Record<TaskColumnCode, string> = {
  TODO: "border-white/10 bg-white/5",
  IN_PROGRESS: "border-primary/20 bg-primary/8",
  DONE: "border-emerald-500/20 bg-emerald-500/8",
}

const defaultTasks = [
  {
    id: "scrum-82",
    jiraCode: "SCRUM-82",
    title: "Definição do modelo ER",
    description: "Relacionar entidades, chaves e vínculos necessários para autenticação e acompanhamento da sprint.",
    priority: "HIGH" as const,
    position: 1,
    storyPoints: 3,
    assignee: "Arquitetura",
    columnCode: "TODO" as const,
  },
  {
    id: "scrum-83",
    jiraCode: "SCRUM-83",
    title: "Diagrama de Classes",
    description: "Detalhar domínio, serviços, controladores e fluxo principal da entrega.",
    priority: "MEDIUM" as const,
    position: 2,
    storyPoints: 2,
    assignee: "Arquitetura",
    columnCode: "TODO" as const,
  },
  {
    id: "scrum-81",
    jiraCode: "SCRUM-81",
    title: "Implementar telas prototipadas",
    description: "Transformar o mockup em uma tela funcional para o dashboard da sprint.",
    priority: "HIGH" as const,
    position: 1,
    storyPoints: 5,
    assignee: "Front-End",
    columnCode: "IN_PROGRESS" as const,
  },
  {
    id: "scrum-84",
    jiraCode: "SCRUM-84",
    title: "Incluir Front-End",
    description: "Conectar login, cadastro, navegação e consumo das informações do quadro.",
    priority: "HIGH" as const,
    position: 2,
    storyPoints: 5,
    assignee: "Front-End",
    columnCode: "IN_PROGRESS" as const,
  },
  {
    id: "scrum-85",
    jiraCode: "SCRUM-85",
    title: "Incluir Back-End",
    description: "Disponibilizar endpoints para board, tarefas e leitura do usuário autenticado.",
    priority: "HIGH" as const,
    position: 3,
    storyPoints: 5,
    assignee: "Back-End",
    columnCode: "IN_PROGRESS" as const,
  },
  {
    id: "scrum-69",
    jiraCode: "SCRUM-69",
    title: "Prototipação de telas e escolha do esquema de cores",
    description: "Consolidar o look & feel que serviu de base para a implementação final.",
    priority: "MEDIUM" as const,
    position: 1,
    storyPoints: 2,
    assignee: "Design",
    columnCode: "DONE" as const,
  },
]

function buildFallbackBoard(): Board {
  const columns: BoardColumn[] = [
    { id: "column-todo", title: "Planejado", code: "TODO", position: 1, tasks: [] },
    { id: "column-progress", title: "Em andamento", code: "IN_PROGRESS", position: 2, tasks: [] },
    { id: "column-done", title: "Concluído", code: "DONE", position: 3, tasks: [] },
  ]

  const columnByCode = new Map(columns.map((column) => [column.code, column]))

  defaultTasks.forEach((task) => {
    const column = columnByCode.get(task.columnCode)
    if (!column) return

    column.tasks.push({
      id: task.id,
      jiraCode: task.jiraCode,
      title: task.title,
      description: task.description,
      priority: task.priority,
      position: task.position,
      storyPoints: task.storyPoints,
      assignee: task.assignee,
      columnId: column.id,
      columnCode: column.code,
    })
  })

  return {
    id: "fallback-board",
    name: "Sprint atual - Implementação",
    description: "Modo local com base no quadro do Jira enviado.",
    columns,
  }
}

function normalizeBoard(board: Board): Board {
  return {
    ...board,
    columns: [...board.columns]
      .sort((left, right) => left.position - right.position)
      .map((column) => ({
        ...column,
        tasks: [...column.tasks].sort((left, right) => left.position - right.position),
      })),
  }
}

function replaceTaskInBoard(board: Board, nextTask: BoardTask): Board {
  const nextColumns = board.columns.map((column) => {
    const filteredTasks = column.tasks.filter((task) => task.id !== nextTask.id)
    if (column.id !== nextTask.columnId) {
      return { ...column, tasks: filteredTasks }
    }

    const mergedTasks = [...filteredTasks, nextTask].sort((left, right) => left.position - right.position)
    return { ...column, tasks: mergedTasks }
  })

  return normalizeBoard({ ...board, columns: nextColumns })
}

function removeTaskFromBoard(board: Board, taskId: string): Board {
  return normalizeBoard({
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== taskId),
    })),
  })
}

function getNextPosition(column: BoardColumn) {
  return Math.max(0, ...column.tasks.map((task) => task.position)) + 1
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board | null>(null)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<"api" | "local">("api")
  const [showNewTask, setShowNewTask] = useState(false)
  const [formData, setFormData] = useState({
    jiraCode: "",
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    columnId: "",
    storyPoints: "3",
    assignee: "",
  })

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [userResult, boardResult] = await Promise.allSettled([fetchCurrentUser(), fetchBoard()])

        if (!active) return

        if (userResult.status === "fulfilled") {
          setCurrentUser(userResult.value)
        }

        if (boardResult.status === "fulfilled") {
          const normalizedBoard = normalizeBoard(boardResult.value)
          setBoard(normalizedBoard)
          setFormData((currentForm) => ({
            ...currentForm,
            columnId: currentForm.columnId || normalizedBoard.columns[0]?.id || "",
          }))
          setMode("api")
          setMessage(userResult.status === "fulfilled" ? null : "Quadro carregado, mas sem sessão autenticada no momento.")
        } else {
          const localBoard = buildFallbackBoard()
          setBoard(localBoard)
          setFormData((currentForm) => ({
            ...currentForm,
            columnId: currentForm.columnId || localBoard.columns[0]?.id || "",
          }))
          setMode("local")
          setMessage("API indisponível ou protegida. O dashboard entrou em modo local para você continuar evoluindo a tela.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const totals = useMemo(() => {
    if (!board) {
      return { total: 0, done: 0, inProgress: 0, completion: 0 }
    }

    const allTasks = board.columns.flatMap((column) => column.tasks)
    const done = board.columns.find((column) => column.code === "DONE")?.tasks.length ?? 0
    const inProgress = board.columns.find((column) => column.code === "IN_PROGRESS")?.tasks.length ?? 0
    const total = allTasks.length

    return {
      total,
      done,
      inProgress,
      completion: total === 0 ? 0 : Math.round((done / total) * 100),
    }
  }, [board])

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // Mantém navegação mesmo se a API não estiver disponível.
    } finally {
      navigate("/")
    }
  }

  async function handleCreateTask() {
    if (!board || !formData.title.trim() || !formData.jiraCode.trim() || saving) {
      return
    }

    const selectedColumn = board.columns.find((column) => column.id === formData.columnId) ?? board.columns[0]
    if (!selectedColumn) {
      return
    }

    const payload: CreateTaskPayload = {
      jiraCode: formData.jiraCode.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      columnId: selectedColumn.id,
      storyPoints: Number.isNaN(Number(formData.storyPoints)) ? null : Number(formData.storyPoints),
      assignee: formData.assignee.trim(),
    }

    setSaving(true)
    setMessage(null)

    try {
      if (mode === "api") {
        const task = await createTask(payload)
        setBoard((currentBoard) => (currentBoard ? replaceTaskInBoard(currentBoard, task) : currentBoard))
      } else {
        const localTask: BoardTask = {
          id: crypto.randomUUID(),
          jiraCode: payload.jiraCode,
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          position: getNextPosition(selectedColumn),
          storyPoints: payload.storyPoints ?? null,
          assignee: payload.assignee || null,
          columnId: selectedColumn.id,
          columnCode: selectedColumn.code,
        }
        setBoard((currentBoard) => (currentBoard ? replaceTaskInBoard(currentBoard, localTask) : currentBoard))
      }

      setFormData((currentForm) => ({
        ...currentForm,
        jiraCode: "",
        title: "",
        description: "",
        priority: "MEDIUM",
        storyPoints: "3",
        assignee: "",
      }))
      setShowNewTask(false)
      setMessage("Task adicionada com sucesso.")
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível criar a task agora."
      setMessage(nextMessage)
    } finally {
      setSaving(false)
    }
  }

  async function handleMoveTask(task: BoardTask, targetColumnId: string) {
    if (!board || saving || task.columnId === targetColumnId) {
      return
    }

    const targetColumn = board.columns.find((column) => column.id === targetColumnId)
    if (!targetColumn) {
      return
    }

    const optimisticTask: BoardTask = {
      ...task,
      columnId: targetColumn.id,
      columnCode: targetColumn.code,
      position: getNextPosition(targetColumn),
    }

    setSaving(true)
    setMessage(null)

    try {
      if (mode === "api") {
        const updatedTask = await updateTask(task.id, {
          columnId: targetColumn.id,
          position: optimisticTask.position,
        })
        setBoard((currentBoard) => (currentBoard ? replaceTaskInBoard(currentBoard, updatedTask) : currentBoard))
      } else {
        setBoard((currentBoard) => (currentBoard ? replaceTaskInBoard(currentBoard, optimisticTask) : currentBoard))
      }
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível mover a task agora."
      setMessage(nextMessage)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!board || saving) {
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      if (mode === "api") {
        await deleteTask(taskId)
      }
      setBoard((currentBoard) => (currentBoard ? removeTaskFromBoard(currentBoard, taskId) : currentBoard))
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível remover a task agora."
      setMessage(nextMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <section className="relative border-b border-white/10">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[90px] left-[-90px] opacity-70" />
            <div className="hero-orb-secondary right-[-120px] bottom-[-20px] opacity-55" />
            <div className="grid-pattern absolute inset-0 opacity-25" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  <Workflow size={14} />
                  Dashboard da sprint
                </span>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  Implementação alinhada ao <span className="gradient-text">Jira</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  Quadro para acompanhar o que faltava na sprint: modelagem, diagramação, telas prototipadas e integração entre front-end e back-end.
                </p>
              </div>

              <div className="glass-card flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-none hover:transform-none lg:min-w-[320px]">
                <div className="flex items-center gap-3">
                  <UserCircle2 className="text-primary" size={22} />
                  <div>
                    <p className="text-sm font-semibold">
                      {currentUser?.name ?? "Sessão local"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email ?? "Sem autenticação ativa"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-background/60 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">Modo de dados</span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold">
                    <Signal size={14} className={mode === "api" ? "text-primary" : "text-amber-500"} />
                    {mode === "api" ? "API conectada" : "Modo local"}
                  </span>
                </div>

                <Button variant="outline" className="rounded-full border-white/15 bg-white/5" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </div>
            </div>

            {message ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                {message}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={ClipboardList} label="Tasks mapeadas" value={String(totals.total)} detail="Itens puxados do quadro da sprint" />
              <MetricCard icon={LoaderCircle} label="Em andamento" value={String(totals.inProgress)} detail="Entrega técnica em progresso" rotateIcon />
              <MetricCard icon={CheckCircle2} label="Concluídas" value={String(totals.done)} detail="Cards já encerrados" />
              <MetricCard icon={Workflow} label="Conclusão" value={`${totals.completion}%`} detail="Percentual atual da sprint" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Quadro operacional</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {board?.description ?? "Carregando quadro..."}
              </p>
            </div>

            <Button className="rounded-full" onClick={() => setShowNewTask((current) => !current)}>
              <Plus size={16} className="mr-2" />
              {showNewTask ? "Fechar formulário" : "Nova task"}
            </Button>
          </div>

          {showNewTask && board ? (
            <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-2 xl:grid-cols-6">
              <label className="space-y-2 xl:col-span-1">
                <span className="text-sm font-medium">Código Jira</span>
                <input
                  value={formData.jiraCode}
                  onChange={(event) => setFormData((current) => ({ ...current, jiraCode: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  placeholder="SCRUM-99"
                />
              </label>
              <label className="space-y-2 xl:col-span-2">
                <span className="text-sm font-medium">Título</span>
                <input
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  placeholder="Descreva a entrega"
                />
              </label>
              <label className="space-y-2 xl:col-span-1">
                <span className="text-sm font-medium">Coluna</span>
                <select
                  value={formData.columnId}
                  onChange={(event) => setFormData((current) => ({ ...current, columnId: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                >
                  {board.columns.map((column) => (
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 xl:col-span-1">
                <span className="text-sm font-medium">Prioridade</span>
                <select
                  value={formData.priority}
                  onChange={(event) => setFormData((current) => ({ ...current, priority: event.target.value as TaskPriority }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                >
                  <option value="HIGH">Alta</option>
                  <option value="MEDIUM">Média</option>
                  <option value="LOW">Baixa</option>
                </select>
              </label>
              <label className="space-y-2 xl:col-span-1">
                <span className="text-sm font-medium">Story points</span>
                <input
                  value={formData.storyPoints}
                  onChange={(event) => setFormData((current) => ({ ...current, storyPoints: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  inputMode="numeric"
                />
              </label>
              <label className="space-y-2 xl:col-span-2">
                <span className="text-sm font-medium">Descrição</span>
                <textarea
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-28 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  placeholder="Detalhe o objetivo da task"
                />
              </label>
              <label className="space-y-2 xl:col-span-2">
                <span className="text-sm font-medium">Responsável</span>
                <input
                  value={formData.assignee}
                  onChange={(event) => setFormData((current) => ({ ...current, assignee: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  placeholder="Ex.: Front-End"
                />
              </label>
              <div className="flex items-end xl:col-span-2">
                <Button className="w-full rounded-full" onClick={handleCreateTask} disabled={saving}>
                  {saving ? "Salvando..." : "Adicionar task"}
                </Button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-muted-foreground">
              Carregando quadro...
            </div>
          ) : null}

          {!loading && board ? (
            <div className="grid gap-5 xl:grid-cols-3">
              {board.columns.map((column) => (
                <div key={column.id} className={`rounded-3xl border p-5 ${columnTone[column.code]}`}>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{column.title}</h3>
                      <p className="text-sm text-muted-foreground">{column.tasks.length} task(s)</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {column.code}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {column.tasks.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-muted-foreground">
                        Nenhuma task nesta coluna.
                      </div>
                    ) : (
                      column.tasks.map((task) => (
                        <article key={task.id} className="rounded-3xl border border-white/10 bg-background/80 p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
                                {task.jiraCode}
                              </span>
                              <h4 className="mt-2 text-base font-semibold">{task.title}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id)}
                              className="rounded-full border border-white/10 p-2 text-muted-foreground transition hover:text-destructive"
                              aria-label={`Remover ${task.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {task.description || "Sem descrição adicional."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold">
                              Prioridade {priorityLabel[task.priority]}
                            </span>
                            {task.storyPoints ? (
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold">
                                {task.storyPoints} pts
                              </span>
                            ) : null}
                            {task.assignee ? (
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-muted-foreground">
                                {task.assignee}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <select
                              value={task.columnId}
                              onChange={(event) => handleMoveTask(task, event.target.value)}
                              className="w-full rounded-2xl border border-white/10 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary/50"
                              disabled={saving}
                            >
                              {board.columns.map((targetColumn) => (
                                <option key={targetColumn.id} value={targetColumn.id}>
                                  Mover para {targetColumn.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  rotateIcon = false,
}: {
  icon: typeof ClipboardList
  label: string
  value: string
  detail: string
  rotateIcon?: boolean
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
        </div>
        <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-background/70 text-primary">
          <Icon size={20} className={rotateIcon ? "animate-spin [animation-duration:3s]" : ""} />
        </div>
      </div>
    </div>
  )
}