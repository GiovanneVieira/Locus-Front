import { useMemo, useState } from "react"
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
import { useLogout, useCurrentUser } from "@/hooks/useAuth"
import { useBoard, useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/useBoard"
import { ApiError } from "@/lib/api"
import type {
  BoardColumn,
  BoardTask,
  CreateTaskPayload,
  TaskPriority,
} from "@/lib/types"

const priorityLabel: Record<TaskPriority, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
}

const priorityTone: Record<TaskPriority, string> = {
  HIGH: "border-red-500/20 bg-red-500/10 text-red-300",
  MEDIUM: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  LOW: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
}

const columnTone = {
  TODO: "border-white/10 bg-white/5",
  IN_PROGRESS: "border-primary/20 bg-primary/8",
  DONE: "border-emerald-500/20 bg-emerald-500/8",
} as const

const defaultForm = {
  jiraCode: "",
  title: "",
  description: "",
  priority: "MEDIUM" as TaskPriority,
  columnId: "",
  storyPoints: "3",
  assignee: "",
}

function getNextPosition(column: BoardColumn) {
  return Math.max(0, ...column.tasks.map((task) => task.position)) + 1
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-background/70 p-3">
          <Icon className={rotateIcon ? "animate-spin-slow" : ""} size={22} />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { data: currentUser, isLoading: loadingUser } = useCurrentUser()
  const { data: board, isLoading: loadingBoard, error: boardError } = useBoard()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const logoutMutation = useLogout()

  const [showNewTask, setShowNewTask] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState(defaultForm)

  const loading = loadingUser || loadingBoard
  const saving =
    createTaskMutation.isPending ||
    updateTaskMutation.isPending ||
    deleteTaskMutation.isPending ||
    logoutMutation.isPending

  const totals = useMemo(() => {
    if (!board) {
      return { total: 0, done: 0, inProgress: 0, completion: 0 }
    }

    const allTasks = board.columns.flatMap((column) => column.tasks)
    const done = board.columns.find((column) => column.code === "DONE")?.tasks.length ?? 0
    const inProgress = board.columns.find((column) => column.code === "IN_PROGRESS")?.tasks.length ?? 0
    const completion = allTasks.length > 0 ? Math.round((done / allTasks.length) * 100) : 0

    return {
      total: allTasks.length,
      done,
      inProgress,
      completion,
    }
  }, [board])

  async function handleLogout() {
    try {
      setMessage(null)
      await logoutMutation.mutateAsync()
      navigate("/auth")
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível encerrar a sessão agora."
      setMessage(nextMessage)
    }
  }

  async function handleCreateTask() {
    if (!board) {
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
      position: getNextPosition(selectedColumn),
      storyPoints: Number.isNaN(Number(formData.storyPoints)) ? null : Number(formData.storyPoints),
      assignee: formData.assignee.trim() || undefined,
    }

    try {
      setMessage(null)
      await createTaskMutation.mutateAsync(payload)
      setFormData({ ...defaultForm, columnId: board.columns[0]?.id ?? "" })
      setShowNewTask(false)
      setMessage("Task adicionada com sucesso.")
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível criar a task agora."
      setMessage(nextMessage)
    }
  }

  async function handleMoveTask(task: BoardTask, targetColumnId: string) {
    if (!board || task.columnId === targetColumnId) {
      return
    }

    const targetColumn = board.columns.find((column) => column.id === targetColumnId)
    if (!targetColumn) {
      return
    }

    try {
      setMessage(null)
      await updateTaskMutation.mutateAsync({
        taskId: task.id,
        payload: {
          columnId: targetColumn.id,
          position: getNextPosition(targetColumn),
        },
      })
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível mover a task agora."
      setMessage(nextMessage)
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      setMessage(null)
      await deleteTaskMutation.mutateAsync(taskId)
      setMessage("Task removida com sucesso.")
    } catch (error) {
      const nextMessage = error instanceof ApiError ? error.message : "Não foi possível remover a task agora."
      setMessage(nextMessage)
    }
  }

  const initialColumnId = board?.columns[0]?.id ?? ""
  const effectiveColumnId = formData.columnId || initialColumnId

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-20">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-muted-foreground">
            <LoaderCircle className="animate-spin" size={18} />
            Carregando dashboard...
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!board) {
    const nextMessage = boardError instanceof Error ? boardError.message : "Não foi possível carregar o dashboard."

    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-20">
          <div className="max-w-xl rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            {nextMessage}
          </div>
        </main>
        <Footer />
      </div>
    )
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
                  Quadro conectado ao back-end, com autenticação, leitura do usuário atual e gestão real de tarefas da sprint.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 lg:min-w-[320px]">
                <div className="flex items-center gap-3">
                  <UserCircle2 className="text-primary" size={22} />
                  <div>
                    <p className="text-sm font-semibold">
                      {currentUser?.name ?? (loadingUser ? "Carregando..." : "Sessão indisponível")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.email ?? "Sem autenticação ativa"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-background/60 px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">Modo de dados</span>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold">
                    <Signal size={14} className="text-primary" />
                    API conectada
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut size={16} className="mr-2" />
                  {logoutMutation.isPending ? "Saindo..." : "Sair"}
                </Button>
              </div>
            </div>

            {message ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                {message}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={ClipboardList} label="Tasks mapeadas" value={String(totals.total)} detail="Itens persistidos no quadro" />
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
              <p className="mt-1 text-sm text-muted-foreground">{board.description}</p>
            </div>

            <Button className="rounded-full" onClick={() => setShowNewTask((current) => !current)}>
              <Plus size={16} className="mr-2" />
              {showNewTask ? "Fechar formulário" : "Nova task"}
            </Button>
          </div>

          {showNewTask ? (
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
                  value={effectiveColumnId}
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
                  placeholder="3"
                />
              </label>

              <label className="space-y-2 md:col-span-2 xl:col-span-2">
                <span className="text-sm font-medium">Responsável</span>
                <input
                  value={formData.assignee}
                  onChange={(event) => setFormData((current) => ({ ...current, assignee: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  placeholder="Ex.: Front-End"
                />
              </label>

              <label className="space-y-2 md:col-span-2 xl:col-span-4">
                <span className="text-sm font-medium">Descrição</span>
                <textarea
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 outline-none transition focus:border-primary/50"
                  placeholder="Descreva o que precisa ser feito"
                />
              </label>

              <div className="md:col-span-2 xl:col-span-6 flex justify-end">
                <Button
                  onClick={handleCreateTask}
                  disabled={saving || !formData.jiraCode.trim() || !formData.title.trim()}
                >
                  {createTaskMutation.isPending ? "Salvando..." : "Salvar task"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-3">
            {board.columns.map((column) => (
              <div key={column.id} className={`rounded-3xl border p-5 ${columnTone[column.code]}`}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{column.title}</h3>
                    <p className="text-sm text-muted-foreground">{column.tasks.length} task(s)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {column.tasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-background/40 px-4 py-8 text-center text-sm text-muted-foreground">
                      Nenhuma task nesta coluna.
                    </div>
                  ) : (
                    column.tasks.map((task) => (
                      <div key={task.id} className="rounded-3xl border border-white/10 bg-background/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold tracking-widest text-primary uppercase">{task.jiraCode}</p>
                            <h4 className="mt-2 text-base font-semibold">{task.title}</h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="rounded-full border border-white/10 bg-white/5 p-2 text-muted-foreground transition hover:text-destructive"
                            aria-label="Excluir task"
                            disabled={saving}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {task.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{task.description}</p> : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityTone[task.priority]}`}>
                            {priorityLabel[task.priority]}
                          </span>

                          {task.storyPoints !== null ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground">
                              {task.storyPoints} SP
                            </span>
                          ) : null}

                          {task.assignee ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground">
                              {task.assignee}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 space-y-2">
                          <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            Mover para
                          </label>
                          <select
                            value={task.columnId}
                            onChange={(event) => handleMoveTask(task, event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none transition focus:border-primary/50"
                            disabled={saving}
                          >
                            {board.columns.map((targetColumn) => (
                              <option key={targetColumn.id} value={targetColumn.id}>
                                {targetColumn.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}