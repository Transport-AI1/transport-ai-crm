
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  LayoutDashboard,
  Users,
  Building2,
  ChartNoAxesCombined,
  Settings,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Mail,
  Phone,
  CalendarDays,
  CircleCheck,
  Clock3,
  CircleAlert,
  X,
  Filter,
  Download,
  MoreHorizontal,
  Sparkles,
  Trash2,
  Pencil,
} from "lucide-react";

type Status = "Nuevo" | "En seguimiento" | "Contactado" | "Cliente";
type Client = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  value: number;
  date: string;
  source: string;
};

const initialClients: Client[] = [
  {
    id: 1,
    name: "Laura Martín",
    company: "Empresa Norte",
    email: "laura@empresanorte.es",
    phone: "+34 600 123 456",
    status: "Nuevo",
    value: 2400,
    date: "21 oct 2026",
    source: "Web",
  },
  {
    id: 2,
    name: "Carlos Sánchez",
    company: "Grupo Central",
    email: "carlos@grupocentral.es",
    phone: "+34 611 234 567",
    status: "En seguimiento",
    value: 5800,
    date: "20 oct 2026",
    source: "Referido",
  },
  {
    id: 3,
    name: "Marta López",
    company: "Servicios Delta",
    email: "marta@serviciosdelta.es",
    phone: "+34 622 345 678",
    status: "Contactado",
    value: 3200,
    date: "19 oct 2026",
    source: "Email",
  },
  {
    id: 4,
    name: "Javier Romero",
    company: "Logística Avanza",
    email: "javier@logisticaavanza.es",
    phone: "+34 633 456 789",
    status: "Cliente",
    value: 8900,
    date: "18 oct 2026",
    source: "Web",
  },
  {
    id: 5,
    name: "Ana Fernández",
    company: "Distribuciones Vega",
    email: "ana@distribucionesvega.es",
    phone: "+34 644 567 890",
    status: "Nuevo",
    value: 1700,
    date: "17 oct 2026",
    source: "LinkedIn",
  },
  {
    id: 6,
    name: "David Torres",
    company: "Transportes Horizonte",
    email: "david@horizonte.es",
    phone: "+34 655 678 901",
    status: "En seguimiento",
    value: 4600,
    date: "16 oct 2026",
    source: "Referido",
  },
];

const statuses: Status[] = [
  "Nuevo",
  "En seguimiento",
  "Contactado",
  "Cliente",
];

const statusStyles: Record<Status, string> = {
  Nuevo: "bg-blue-50 text-blue-700 ring-blue-200",
  "En seguimiento": "bg-amber-50 text-amber-700 ring-amber-200",
  Contactado: "bg-violet-50 text-violet-700 ring-violet-200",
  Cliente: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const euro = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selected, setSelected] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Nuevo" as Status,
    value: "2500",
    source: "Web",
  });

  const filtered = useMemo(
    () =>
      clients.filter((client) => {
        const query = search.toLowerCase();
        const matchesSearch =
          client.name.toLowerCase().includes(query) ||
          client.company.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "Todos" || client.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [clients, search, statusFilter],
  );

  const totalValue = clients.reduce((sum, client) => sum + client.value, 0);
  const activeLeads = clients.filter((client) => client.status !== "Cliente").length;
  const customers = clients.filter((client) => client.status === "Cliente").length;

  function openNew() {
    setEditing(null);
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "Nuevo",
      value: "2500",
      source: "Web",
    });
    setShowForm(true);
  }

  function openEdit(client: Client) {
    setEditing(client);
    setForm({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status,
      value: String(client.value),
      source: client.source,
    });
    setSelected(null);
    setShowForm(true);
  }

  function saveClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const record: Client = {
      id: editing?.id ?? Math.max(0, ...clients.map((client) => client.id)) + 1,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status,
      value: Math.max(0, Number(form.value) || 0),
      date: editing?.date ?? new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      source: form.source,
    };

    setClients((previous) =>
      editing
        ? previous.map((client) => (client.id === editing.id ? record : client))
        : [record, ...previous],
    );
    setShowForm(false);
    setSelected(null);
    setNotice(editing ? "Contacto actualizado correctamente" : "Contacto añadido correctamente");
    window.setTimeout(() => setNotice(""), 3000);
  }

  function deleteClient(client: Client) {
    if (!window.confirm(`¿Eliminar a ${client.name} de la demo?`)) return;
    setClients((previous) => previous.filter((item) => item.id !== client.id));
    setSelected(null);
    setNotice("Contacto eliminado de la demo");
    window.setTimeout(() => setNotice(""), 3000);
  }

  function exportCSV() {
    const rows = [
      ["Nombre", "Empresa", "Email", "Teléfono", "Estado", "Valor", "Origen"],
      ...filtered.map((client) => [
        client.name,
        client.company,
        client.email,
        client.phone,
        client.status,
        String(client.value),
        client.source,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transport-ai-crm.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
          <a href="#" className="flex items-center gap-3 px-2 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight">Transport AI</span>
              <span className="block text-xs text-slate-500">CRM empresarial</span>
            </span>
          </a>

          <div className="mt-10">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Espacio de trabajo
            </p>
            <nav className="space-y-1">
              {[
                { label: "Resumen", icon: LayoutDashboard },
                { label: "Contactos", icon: Users },
                { label: "Empresas", icon: Building2 },
                { label: "Informes", icon: ChartNoAxesCombined },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (index === 1) document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
                      else setNotice(index === 0 ? "Estás viendo el resumen del CRM" : `${item.label}: sección de demostración`);
                      window.setTimeout(() => setNotice(""), 2500);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                      index === 1
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                    {index === 1 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold">Menos tareas manuales.</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Centraliza tus oportunidades y mantén el seguimiento organizado.
            </p>
            <a
              href="https://wa.me/34659980603?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20un%20CRM%20para%20mi%20empresa."
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs font-bold text-slate-950 hover:bg-blue-50"
            >
              Solicitar información <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
            <div>
              <p className="text-xs text-slate-400">Transport AI / CRM</p>
              <h1 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">Gestión de clientes</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex sm:items-center sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Demo interactiva
              </span>
              <button
                aria-label="Notificaciones"
                onClick={() => setNotice("No tienes notificaciones nuevas en esta demo")}
                className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
              </button>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">TA</div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold">Equipo Transport AI</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">Administrador</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-4 sm:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Espacio de trabajo inteligente
                </div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Tu negocio, más organizado.</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Gestiona contactos, oportunidades y seguimientos desde un solo lugar.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" /> Exportar
                </button>
                <button
                  onClick={openNew}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" /> Añadir contacto
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Contactos totales", value: clients.length.toString(), note: "En tu espacio de trabajo", icon: Users, tone: "blue" },
                { label: "Oportunidades activas", value: activeLeads.toString(), note: "Pendientes de conversión", icon: Clock3, tone: "amber" },
                { label: "Clientes", value: customers.toString(), note: "Relaciones confirmadas", icon: CircleCheck, tone: "emerald" },
                { label: "Valor de oportunidades", value: euro(totalValue), note: "Valor estimado del pipeline", icon: ChartNoAxesCombined, tone: "violet" },
              ].map((metric) => {
                const Icon = metric.icon;
                const tone = {
                  blue: "bg-blue-50 text-blue-700",
                  amber: "bg-amber-50 text-amber-700",
                  emerald: "bg-emerald-50 text-emerald-700",
                  violet: "bg-violet-50 text-violet-700",
                }[metric.tone];
                return (
                  <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                        <p className="mt-3 text-2xl font-extrabold tracking-tight">{metric.value}</p>
                      </div>
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-4 text-[11px] text-slate-400">{metric.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Pipeline comercial</h3>
                    <p className="mt-1 text-xs text-slate-500">Contactos por etapa</p>
                  </div>
                  <span className="rounded-lg bg-slate-50 p-2 text-slate-500"><ChartNoAxesCombined className="h-4 w-4" /></span>
                </div>
                <div className="mt-6 space-y-5">
                  {statuses.map((status) => {
                    const count = clients.filter((client) => client.status === status).length;
                    const percent = clients.length ? (count / clients.length) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-600">{status}</span>
                          <span className="font-bold text-slate-900">{count} <span className="font-normal text-slate-400">contactos</span></span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              status === "Nuevo" ? "bg-blue-500" :
                              status === "En seguimiento" ? "bg-amber-400" :
                              status === "Contactado" ? "bg-violet-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-blue-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-white/10 p-2"><Sparkles className="h-5 w-5 text-blue-300" /></span>
                  <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-blue-200">Transport AI</span>
                </div>
                <h3 className="mt-5 text-xl font-bold">Cada oportunidad, bajo control.</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Centraliza los datos de tus contactos, identifica el siguiente paso y mantén el seguimiento organizado.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { icon: CircleCheck, text: "Información centralizada" },
                    { icon: Clock3, text: "Seguimientos más claros" },
                    { icon: ChartNoAxesCombined, text: "Visión del pipeline" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-3 text-xs text-slate-200">
                        <Icon className="h-4 w-4 text-emerald-300" />
                        {item.text}
                      </div>
                    );
                  })}
                </div>
                <a
                  href="https://wa.me/34659980603?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20un%20CRM%20de%20Transport%20AI."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
                >
                  Solicitar una solución <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div id="contacts" className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h3 className="font-bold">Contactos y oportunidades</h3>
                  <p className="mt-1 text-xs text-slate-500">Consulta, filtra y gestiona tu cartera comercial.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Buscar contacto..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-56"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-400 sm:w-48"
                    >
                      <option value="Todos">Todos los estados</option>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Contacto / empresa</th>
                      <th className="px-4 py-4">Estado</th>
                      <th className="px-4 py-4">Valor estimado</th>
                      <th className="px-4 py-4">Origen</th>
                      <th className="px-4 py-4">Última actividad</th>
                      <th className="px-4 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((client) => (
                      <tr key={client.id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <button onClick={() => setSelected(client)} className="flex items-center gap-3 text-left">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-xs font-bold text-blue-700">
                              {client.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-slate-900">{client.name}</span>
                              <span className="mt-1 block text-xs text-slate-500">{client.company}</span>
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold ring-1 ring-inset ${statusStyles[client.status]}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-700">{euro(client.value)}</td>
                        <td className="px-4 py-4 text-xs text-slate-500">{client.source}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
                            <CalendarDays className="h-3.5 w-3.5" /> {client.date}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            aria-label={`Ver ${client.name}`}
                            onClick={() => setSelected(client)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <Search className="mx-auto h-8 w-8 text-slate-300" />
                          <p className="mt-3 text-sm font-semibold">No se han encontrado contactos</p>
                          <p className="mt-1 text-xs text-slate-500">Prueba con otra búsqueda o cambia el filtro.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-400 sm:flex-row sm:items-center">
                <span>Mostrando {filtered.length} de {clients.length} contactos</span>
                <span>Datos de ejemplo · Demostración interactiva</span>
              </div>
            </div>

            <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center">
              <span>© 2026 Transport AI · CRM empresarial</span>
              <span className="flex items-center gap-2"><CircleCheck className="h-3.5 w-3.5 text-emerald-500" /> Interfaz de demostración</span>
            </footer>
          </div>
        </section>
      </div>

      {notice && (
        <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-2xl">
          <CircleCheck className="h-5 w-5 shrink-0 text-emerald-400" />
          {notice}
          <button onClick={() => setNotice("")} aria-label="Cerrar aviso"><X className="h-4 w-4" /></button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs text-slate-400">Ficha del contacto</p>
                <h3 className="mt-1 text-lg font-bold">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Cerrar ficha" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Empresa</p>
                <p className="mt-1 font-semibold">{selected.company}</p>
                <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex items-start gap-3 text-sm"><Mail className="mt-0.5 h-4 w-4 text-slate-400" /><span className="break-all">{selected.email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-slate-400" />{selected.phone}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs text-slate-500">Valor estimado</p><p className="mt-1 font-bold">{euro(selected.value)}</p></div>
                <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs text-slate-500">Origen</p><p className="mt-1 font-bold">{selected.source}</p></div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">Cambiar estado</label>
                <select
                  value={selected.status}
                  onChange={(event) => {
                    const status = event.target.value as Status;
                    const updated = { ...selected, status };
                    setClients((previous) => previous.map((client) => client.id === selected.id ? updated : client));
                    setSelected(updated);
                    setNotice("Estado actualizado en esta demo");
                    window.setTimeout(() => setNotice(""), 2500);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
                >
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <button onClick={() => openEdit(selected)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"><Pencil className="h-4 w-4" /> Editar contacto</button>
                <button onClick={() => deleteClient(selected)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
          <form onSubmit={saveClient} className="my-auto w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs text-slate-400">CRM · Transport AI</p>
                <h3 className="mt-1 text-lg font-bold">{editing ? "Editar contacto" : "Añadir contacto"}</h3>
              </div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Cerrar formulario" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {[
                { label: "Nombre completo", key: "name", placeholder: "Ej. Laura Martín", required: true },
                { label: "Empresa", key: "company", placeholder: "Nombre de la empresa", required: true },
                { label: "Correo electrónico", key: "email", placeholder: "nombre@empresa.es", required: true },
                { label: "Teléfono", key: "phone", placeholder: "+34 600 000 000", required: false },
              ].map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">{field.label}</span>
                  <input
                    required={field.required}
                    type={field.key === "email" ? "email" : "text"}
                    value={form[field.key as "name" | "company" | "email" | "phone"]}
                    onChange={(event) => setForm((previous) => ({ ...previous, [field.key]: event.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </label>
              ))}
              <label>
                <span className="mb-2 block text-xs font-semibold text-slate-600">Estado</span>
                <select value={form.status} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as Status }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400">
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold text-slate-600">Valor estimado (€)</span>
                <input type="number" min="0" value={form.value} onChange={(event) => setForm((previous) => ({ ...previous, value: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-400" />
              </label>
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-slate-600">Origen del contacto</span>
                <select value={form.source} onChange={(event) => setForm((previous) => ({ ...previous, source: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400">
                  {["Web", "Email", "Referido", "LinkedIn", "Teléfono", "Otro"].map((source) => <option key={source}>{source}</option>)}
                </select>
              </label>
            </div>
            <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 p-5 sm:flex-row">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"><Plus className="h-4 w-4" /> {editing ? "Guardar cambios" : "Crear contacto"}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
