import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock,
  FileText,
  RotateCcw,
  Stethoscope,
  UserRound,
  UserX,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/features/auth";
import { getAppointment } from "@/features/appointments/api/appointments-api";
import {
  appointmentKeys,
  useAppointmentAction,
} from "@/features/appointments/hooks/use-appointment-mutations";
import { getFreeSlots } from "@/features/calendar/api/calendar-api";
import { AppLoading } from "@/shared/components/feedback/AppLoading";
import { cn } from "@/lib/utils";

const today = new Date().toISOString().slice(0, 10);
const dateFmt = new Intl.DateTimeFormat("es-PE", { dateStyle: "long" });

// step: posición en el flujo feliz (1 reservada, 2 confirmada, 3 completada); 0 = terminal negativo.
const statusMeta = {
  PENDING: { label: "Pendiente", step: 1, tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  CONFIRMED: { label: "Confirmada", step: 2, tone: "bg-primary/15 text-primary" },
  RESCHEDULED: { label: "Reprogramada", step: 1, tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
  COMPLETED: { label: "Completada", step: 3, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  REJECTED: { label: "Rechazada", step: 0, tone: "bg-red-500/15 text-red-700 dark:text-red-300" },
  NO_SHOW: { label: "Inasistencia", step: 0, tone: "bg-red-500/15 text-red-700 dark:text-red-300" },
  CANCELLED: { label: "Cancelada", step: 0, tone: "bg-red-500/15 text-red-700 dark:text-red-300" },
};
const STEPS = [{ n: 1, label: "Reservada" }, { n: 2, label: "Confirmada" }, { n: 3, label: "Completada" }];

function Tile({ icon: Icon, label, value, wide }) {
  return (
    <div className={cn("rounded-xl border bg-card p-4", wide && "sm:col-span-2")}>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5 text-primary" /> {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const n = useNavigate();
  const { data: s } = useSession();
  const query = useQuery({
    queryKey: [...appointmentKeys.all, "detail", id],
    queryFn: () => getAppointment(id),
  });
  const mutation = useAppointmentAction();
  const [confirm, setConfirm] = useState(null);
  const [modal, setModal] = useState(null);
  const [date, setDate] = useState(today);
  const [newScheduleId, setNewScheduleId] = useState("");
  const [clinical, setClinical] = useState({
    reason: "",
    diagnosis: "",
    treatment: "",
    observations: "",
  });

  const a = query.data;
  const manage = s.permissions.includes("Appointment:Update");
  const patient = s.roles.includes("Paciente");
  const slots = useQuery({
    queryKey: ["calendar", "free", date, a?.doctorId],
    queryFn: () => getFreeSlots({ date, doctorId: a.doctorId }),
    enabled: modal === "reschedule" && !!a,
  });

  if (query.isPending) return <AppLoading label="Consultando cita" />;
  if (query.error) throw query.error;

  async function act(action, payload) {
    await mutation.mutateAsync({ id, action, payload });
    setConfirm(null);
    setModal(null);
  }

  const meta = statusMeta[a.status] ?? { label: a.status, step: 0, tone: "bg-muted text-muted-foreground" };
  const terminalNegative = meta.step === 0;
  const canCancel = patient && !["CANCELLED", "COMPLETED", "REJECTED"].includes(a.status);

  const actions = [];
  if (manage && a.status === "PENDING") {
    actions.push(<Button key="c" onClick={() => setConfirm("confirm")}><Check /> Confirmar</Button>);
    actions.push(<Button key="r" variant="destructive" onClick={() => setConfirm("reject")}><X /> Rechazar</Button>);
  }
  if (manage && ["PENDING", "CONFIRMED"].includes(a.status)) {
    actions.push(<Button key="rs" variant="outline" onClick={() => setModal("reschedule")}><RotateCcw /> Reprogramar</Button>);
  }
  if (manage && a.status === "CONFIRMED") {
    actions.push(<Button key="co" onClick={() => setModal("complete")}><ClipboardCheck /> Completar atención</Button>);
    actions.push(<Button key="ns" variant="outline" onClick={() => setConfirm("no-show")}><UserX /> Marcar inasistencia</Button>);
  }
  if (patient && a.status === "RESCHEDULED") {
    actions.push(<Button key="ac" onClick={() => setConfirm("accept")}><CalendarClock /> Aceptar nuevo horario</Button>);
  }
  if (canCancel) {
    actions.push(<Button key="ca" variant="destructive" onClick={() => setConfirm("cancel")}><X /> Cancelar cita</Button>);
  }

  return (
    <section className="mx-auto grid w-full max-w-3xl gap-6">
      <Button className="w-fit" variant="ghost" onClick={() => n("/dashboard/citas")}>
        <ArrowLeft /> Volver a citas
      </Button>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Cabecera */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Stethoscope className="size-6" />
            </span>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Cita con {a.doctorName}</h1>
              <p className="text-sm text-muted-foreground">Paciente: {a.patientName}</p>
            </div>
          </div>
          <Badge className={cn("border-0 px-3 py-1 text-sm font-medium", meta.tone)}>{meta.label}</Badge>
        </div>

        <div className="grid gap-6 p-5">
          {/* Estado */}
          {terminalNegative ? (
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">
              <X className="size-4" /> Esta cita finalizó como: {meta.label}
            </div>
          ) : (
            <ol className="flex items-center">
              {STEPS.map((st, index) => {
                const done = meta.step >= st.n;
                return (
                  <li key={st.n} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn("flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors", done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        {done ? <Check className="size-4" /> : st.n}
                      </span>
                      <span className={cn("text-xs", done ? "font-medium text-foreground" : "text-muted-foreground")}>{st.label}</span>
                    </div>
                    {index < STEPS.length - 1 && <span className={cn("mx-2 mb-4 h-0.5 flex-1 rounded", meta.step > st.n ? "bg-primary" : "bg-muted")} />}
                  </li>
                );
              })}
            </ol>
          )}

          {/* Datos */}
          <dl className="grid gap-4 sm:grid-cols-2">
            <Tile icon={CalendarDays} label="Fecha" value={dateFmt.format(new Date(`${a.date}T00:00:00`))} />
            <Tile icon={Clock} label="Horario" value={`${a.startTime.slice(0, 5)} – ${a.endTime.slice(0, 5)}`} />
            <Tile icon={Stethoscope} label="Médico" value={a.doctorName} />
            <Tile icon={UserRound} label="Paciente" value={a.patientName} />
            <Tile icon={FileText} label="Notas" value={a.notes || "Sin notas"} wide />
          </dl>

          {mutation.error && (
            <Alert variant="destructive">
              <AlertDescription>{mutation.error.message}</AlertDescription>
            </Alert>
          )}

          {actions.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 border-t pt-5">{actions}</div>
          )}
        </div>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
            <AlertDialogDescription>
              Esta operación cambiará el estado de la cita y notificará a la contraparte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction onClick={() => act(confirm)}>
              {mutation.isPending ? "Procesando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={modal === "reschedule"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogramar cita</DialogTitle>
            <DialogDescription>El paciente deberá aceptar el nuevo horario.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel>Fecha</FieldLabel>
            <Input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setNewScheduleId("");
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Nueva franja</FieldLabel>
            <NativeSelect value={newScheduleId} onChange={(e) => setNewScheduleId(e.target.value)}>
              <NativeSelectOption value="">Seleccionar</NativeSelectOption>
              {slots.data?.map((x) => (
                <NativeSelectOption key={x.scheduleId} value={x.scheduleId}>
                  {x.startTime.slice(0, 5)} – {x.endTime.slice(0, 5)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button>
            <Button disabled={!newScheduleId || mutation.isPending} onClick={() => act("reschedule", newScheduleId)}>
              Reprogramar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "complete"} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-slate-100 px-6 py-5 pr-14">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Stethoscope className="size-5" />
              </span>
              <div className="grid gap-1">
                <DialogTitle className="text-lg font-semibold">Completar atención</DialogTitle>
                <DialogDescription>Registra el resumen clínico de esta consulta.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
            {Object.entries({
              reason: ["Motivo de consulta", "Describe el motivo principal"],
              diagnosis: ["Diagnóstico", "Ingresa el diagnóstico"],
              treatment: ["Tratamiento indicado", "Detalla el tratamiento o indicaciones"],
              observations: ["Observaciones adicionales", "Añade notas relevantes para la historia clínica"],
            }).map(([key, [label, placeholder]]) => (
              <Field
                key={key}
                className={["treatment", "observations"].includes(key) ? "sm:col-span-2" : ""}
              >
                <FieldLabel className="text-sm font-medium text-slate-700">{label}</FieldLabel>
                <Textarea
                  className="min-h-24 resize-none rounded-xl border-slate-200 bg-slate-50/60 px-3 py-2.5 shadow-none transition-colors focus-visible:border-emerald-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-600/10"
                  placeholder={placeholder}
                  value={clinical[key]}
                  onChange={(e) =>
                    setClinical((v) => ({ ...v, [key]: e.target.value }))
                  }
                />
              </Field>
            ))}
          </div>
          <DialogFooter className="m-0 rounded-none border-t border-slate-100 bg-white px-6 py-4">
            <Button className="h-10 rounded-xl px-4" variant="ghost" onClick={() => setModal(null)}>
              Cancelar
            </Button>
            <Button
              className="h-10 rounded-xl bg-emerald-600 px-5 shadow-sm hover:bg-emerald-700"
              disabled={mutation.isPending}
              onClick={() => act("complete", clinical)}
            >
              <Stethoscope />
              {mutation.isPending ? "Guardando..." : "Finalizar atención"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
