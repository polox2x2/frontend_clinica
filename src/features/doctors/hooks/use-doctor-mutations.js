import { useMutation,useQueryClient } from '@tanstack/react-query'
import { doctorsClient } from '@/features/doctors/api/doctors-api'
export const doctorKeys=Object.freeze({all:['doctors']})
function useDoctorMutation(mutationFn){const qc=useQueryClient();return useMutation({mutationFn,onSuccess:()=>qc.invalidateQueries({queryKey:doctorKeys.all})})}
export const useCreateDoctor=()=>useDoctorMutation(v=>doctorsClient.create(v))
export const useUpdateDoctor=id=>useDoctorMutation(v=>doctorsClient.update(id,v))
export const useDeleteDoctor=()=>useDoctorMutation(id=>doctorsClient.remove(id))
