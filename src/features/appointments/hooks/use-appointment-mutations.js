import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptAppointment,
  bookAppointment,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  noShowAppointment,
  rejectAppointment,
  rescheduleAppointment,
} from "@/features/appointments/api/appointments-api";
export const appointmentKeys = { all: ["appointments"] };
function useAction(fn) {
  const q = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      await Promise.all([
        q.invalidateQueries({ queryKey: appointmentKeys.all }),
        q.invalidateQueries({ queryKey: ["calendar"] }),
        q.invalidateQueries({ queryKey: ["schedules"] }),
      ]);
    },
  });
}
export const useBookAppointment = () => useAction(bookAppointment);
export const useAppointmentAction = () =>
  useAction(({ id, action, payload }) =>
    ({
      confirm: confirmAppointment,
      reject: rejectAppointment,
      accept: acceptAppointment,
      cancel: cancelAppointment,
      "no-show": noShowAppointment,
      reschedule: (x) => rescheduleAppointment(x, payload),
      complete: (x) => completeAppointment(x, payload),
    })[action](id),
  );
