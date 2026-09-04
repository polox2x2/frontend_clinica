import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMyPatientProfile, patientsClient, updateMyPatientProfile } from '@/features/patients/api/patients-api'

export const patientKeys = Object.freeze({ all: ['patients'], me: ['patients', 'me'] })
function usePatientMutation(mutationFn) { const queryClient = useQueryClient(); return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.all }) }) }
export const useCreatePatient = () => usePatientMutation((values) => patientsClient.create(values))
export const useUpdatePatient = (id) => usePatientMutation((values) => patientsClient.update(id, values))
export const useDeletePatient = () => usePatientMutation((id) => patientsClient.remove(id))
export function useSaveMyPatientProfile(exists) { const queryClient = useQueryClient(); return useMutation({ mutationFn: exists ? updateMyPatientProfile : createMyPatientProfile, onSuccess: () => queryClient.invalidateQueries({ queryKey: patientKeys.me }) }) }
