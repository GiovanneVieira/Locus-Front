# LOCUS FRONT-END DEVELOPMENT BLUEPRINT (AGENTS.MD)

Este documento estabelece as diretrizes arquiteturais, restrições de design e padrões de implementação mandatórios para o ecossistema cliente da plataforma Locus. Qualquer alteração, refatoração ou nova funcionalidade introduzida por desenvolvedores ou agentes autônomos de IA deve obedecer estritamente a este manual.

---

## 1. Stack Tecnológica de Referência
* **Core:** React 19.2+ (Uso de Hooks nativos, sem componentes de classe).
* **Build System:** Vite 7.3+ e TypeScript ~5.9+ (Configuração estrita de tipos).
* **Estilização:** Tailwind CSS v4.2+ (Uso de diretivas modernas e variáveis nativas).
* **Gerenciamento de Estado de Rede:** @tanstack/react-query v5.91+ (TanStack Query).
* **Gerenciamento de Formulários:** @tanstack/react-form v1.28+.
* **Roteamento:** React Router v7.13+.

---

## 2. Padrões Arquiteturais e SOLID no Front-End

### 2.1. Princípio da Responsabilidade Única (SRP) nos Componentes e Chamadas de Rede
* **Camada de Infraestrutura de Rede (`src/lib/api.ts`):** Deve conter apenas funções puras de transporte assíncrono (Axios/Fetch). Ela desconhece o ciclo de vida do React, estados de loading ou cache do cliente.
* **Camada de Estado de Rede (Custom Hooks - `src/hooks/`):** Centraliza as chaves de cache (`queryKeys`), as configurações de stale time, retries e as chamadas imperativas do TanStack Query (`useQuery`, `useMutation`).
* **Camada de Apresentação (Componentes - `src/components/`):** Deve ser estritamente declarativa. O componente recebe os dados processados dos hooks e renderiza o JSX. Nenhuma manipulação direta de fetch ou transformação bruta de dados de rede deve ocorrer dentro do corpo do componente de UI.

### 2.2. Padrão de Composição sobre Herança (Composition Pattern em React)
* **UI Declarativa e Flexível:** Evite a criação de componentes com dezenas de propriedades booleanas para alterar radicalmente seu comportamento. Prefira a composição estrutural utilizando a propriedade `children` ou o padrão de subcomponentes compostos (Dot Notation), estendendo as propriedades dos elementos nativos via TypeScript.
* **Hooks de Composição Comportamental:** Separe lógicas reutilizáveis de eventos globais (ex: atalhos de teclado como `useSearchShortcut` e `useNavigationShortcuts`) de componentes específicos, injetando o comportamento dinamicamente onde necessário.

### 2.3. Segregação de Interfaces (ISP) e Tipagem de payloads
* Toda resposta de rede mapeada de componentes do OpenAPI deve ter uma interface estrita equivalente em `src/lib/types.ts`.
* Componentes menores ou funções auxiliares de formatação de dados devem receber interfaces segregadas contendo apenas os dados mínimos necessários para sua execução (ex: interface `MetricDef` tipando explicitamente callbacks de extração e ícones dinâmicos).

---

## 3. Alinhamento com as Heurísticas de Nielsen

Para garantir uma interface previsível, ágil e ergonômica, todas as views administrativas e de usuários devem implementar nativamente:

### 3.1. Visibilidade do Status do Sistema (Heurística #1)
* Cada alteração no estado de rede precisa ser visualmente comunicada ao usuário. Hooks que retornam `isLoading` ou `isFetching` devem ativar sincronizadamente componentes de esqueleto (Skeletons) ou indicadores de mutação em andamento (`Loader2` com rotação animada).

### 3.2. Prevenção de Erros (Heurística #5)
* A camada de formulários (`@tanstack/react-form`) deve interceptar inputs e disparar validações antes que requisições inválidas atinjam o backend.
* O interceptor de requisições em `api.ts` deve tratar falhas de forma resiliente, executando o fluxo de atualização de token silencioso (`tryRefreshToken`) automaticamente sob o status 401, evitando deslogar o usuário por expiração de sessão durante o uso ativo.

### 3.3. Reconhecimento em vez de Recordação (Heurística #6)
* Dados brutos vindos da API (como timestamps ISO, contagens numéricas densas ou tamanhos em bytes) nunca devem ser jogados diretamente na tela. Devem ser encapsulados por funções utilitárias puras de transformação (ex: `formatNumber` com `Intl.NumberFormat` em formato local `pt-BR`), reduzindo a carga cognitiva do operador.

### 3.4. Flexibilidade e Eficiência de Uso (Heurística #7)
* Endpoints do servidor que expõem coleções grandes utilizam paginação estruturada (`PagedResponse<T>`). O front-end deve refletir essa paginação controlando estados dinâmicos de página e tamanho (`page`, `size`) para manter o consumo de memória do navegador otimizado.

---

## 4. Plano de Refatoração Crítica Imediata

Mapeamos uma dessincronização severa entre o componente `AdminMetrics.tsx` atual e os novos endpoints documentados na OpenAPI do Backend. As seguintes correções devem ser priorizadas:

### 4.1. Sincronização do Modelo de Dados de Métricas (Mapeamento OpenAPI)
* **Problema Atual:** O array estático `METRICS` em `AdminMetrics.tsx` busca propriedades brutas e simplificadas diretamente na raiz do objeto retornado pelo hook (ex: `m.totalUsers`, `m.totalHosts`, `m.activeUsers`).
* **Ajuste Obrigatório:** A resposta real do backend para o endpoint `/admin/metrics` foi atualizada para a estrutura `AdminMetricsOverviewDTO`. O hook `useAdminMetrics` deve ser ajustado para repassar esse novo modelo composto, e as funções de extração (`getValue`) no componente devem ler as propriedades das sub-estruturas corretas:
    * `m.users.newUsersDaily`, `m.users.newUsersWeekly`, `m.users.newUsersMonthly`
    * `m.accessPlatforms.successfulLogins`, `m.accessPlatforms.deviceDistribution` (Array de `MetricCountDTO`)
    * `m.rentals.conversionRate`
    * `m.storageUploads.totalBytes`

### 4.2. Parametrização Temporal do Dashboard
* O método `fetchAdminMetrics()` em `api.ts` precisa ser modificado para receber parâmetros opcionais de data e granularidade (`start`, `end`, `granularity`), mapeando a assinatura `/admin/metrics?start={...}&end={...}&granularity={...}`. O componente deve expor seletores de período visual para controlar esses estados.

### 4.3. Implementação das Views Paginadas de Auditoria e Falhas
* Aproveitando as definições de `/admin/metrics/critical-failures` e `/admin/metrics/access-logs`, o componente correspondente em `AdminMetrics.tsx` deve ser expandido para renderizar tabelas densas paginadas usando o tipo genérico `PagedResponse<T>` exposto em `api.ts`, dando visibilidade a tentativas fraudulentas de login e expiração de OTP diretamente aos administradores da plataforma.