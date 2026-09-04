import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  ClipboardCheck,
  RefreshCw,
  RotateCcw,
  Stethoscope,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
const labels = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    REJECTED: "Rechazada",
    RESCHEDULED: "Reprogramada",
    COMPLETED: "Completada",
    NO_SHOW: "Inasistencia",
    CANCELLED: "Cancelada",
  },
  today = new Date().toISOString().slice(0, 10);
export default function AppointmentDetailPage() {
  const { id } = useParams(),
    n = useNavigate(),
    { data: s } = useSession(),
    query = useQuery({
      queryKey: [...appointmentKeys.all, "detail", id],
      queryFn: () => getAppointment(id),
    }),
    mutation = useAppointmentAction(),
    [confirm, setConfirm] = useState(null),
    [modal, setModal] = useState(null),
    [date, setDate] = useState(today),
    [newScheduleId, setNewScheduleId] = useState(""),
    [clinical, setClinical] = useState({
      reason: "",
      diagnosis: "",
      treatment: "",
      observations: "",
    });
  const a = query.data,
    manage = s.permissions.includes("Appointment:Update"),
    patient = s.roles.includes("Paciente"),
    slots = useQuery({
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
  const canCancel =
    patient && !["CANCELLED", "COMPLETED", "REJECTED"].includes(a.status);
  return (
    <section className="mx-auto grid w-full max-w-4xl gap-6">
      <Button
        className="w-fit"
        variant="ghost"
        onClick={() => n("/dashboard/citas")}
      >
        <ArrowLeft />
        Volver a citas
      </Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Cita con {a.doctorName}</CardTitle>
              <CardDescription>{a.patientName}</CardDescription>
            </div>
            <Badge>{labels[a.status]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Fecha</dt>
              <dd className="font-medium">
                {new Intl.DateTimeFormat("es-PE", { dateStyle: "long" }).format(
                  new Date(`${a.date}T00:00:00`),
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Horario</dt>
              <dd className="font-medium">
                {a.startTime.slice(0, 5)} – {a.endTime.slice(0, 5)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Notas</dt>
              <dd>{a.notes || "Sin notas"}</dd>
            </div>
          </dl>
          {mutation.error && (
            <Alert variant="destructive">
              <AlertDescription>{mutation.error.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-wrap gap-2">
            {manage && a.status === "PENDING" && (
              <>
                <Button onClick={() => setConfirm("confirm")}>
                  <Check />
                  Confirmar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setConfirm("reject")}
                >
                  <X />
                  Rechazar
                </Button>
              </>
            )}
            {manage && ["PENDING", "CONFIRMED"].includes(a.status) && (
              <Button variant="outline" onClick={() => setModal("reschedule")}>
                <RotateCcw />
                Reprogramar
              </Button>
            )}
            {manage && a.status === "CONFIRMED" && (
              <>
                <Button onClick={() => setModal("complete")}>
                  <ClipboardCheck />
                  Completar atención
                </Button>
                <Button variant="outline" onClick={() => setConfirm("no-show")}>
                  <UserX />
                  Marcar inasistencia
                </Button>
              </>
            )}
            {patient && a.status === "RESCHEDULED" && (
              <Button onClick={() => setConfirm("accept")}>
                <CalendarClock />
                Aceptar nuevo horario
              </Button>
            )}
            {canCancel && (
              <Button
                variant="destructive"
                onClick={() => setConfirm("cancel")}
              >
                <X />
                Cancelar cita
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar acción</AlertDialogTitle>
            <AlertDialogDescription>
              Esta operación cambiará el estado de la cita y notificará a la
              contraparte.
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
      <Dialog
        open={modal === "reschedule"}
        onOpenChange={(o) => !o && setModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogramar cita</DialogTitle>
            <DialogDescription>
              El paciente deberá aceptar el nuevo horario.
            </DialogDescription>
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
            <NativeSelect
              value={newScheduleId}
              onChange={(e) => setNewScheduleId(e.target.value)}
            >
              <NativeSelectOption value="">Seleccionar</NativeSelectOption>
              {slots.data?.map((x) => (
                <NativeSelectOption key={x.scheduleId} value={x.scheduleId}>
                  {x.startTime.slice(0, 5)} – {x.endTime.slice(0, 5)}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal(null)}>
              Cancelar
            </Button>
            <Button
              disabled={!newScheduleId || mutation.isPending}
              onClick={() => act("reschedule", newScheduleId)}
            >
              Reprogramar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal === "complete"}
        onOpenChange={(o) => !o && setModal(null)}
      >
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
