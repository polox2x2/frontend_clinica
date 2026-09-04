import { useMutation, useQueryClient } from '@tanstack/react-query'
import { specialitiesClient } from '@/features/specialities/api/specialities-api'

export const specialityKeys = Object.freeze({ all: ['specialities'] })
function useSpecialityMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSuccess: () => queryClient.invalidateQueries({ queryKey: specialityKeys.all }) })
}
export const useCreateSpeciality = () => useSpecialityMutation((values) => specialitiesClient.create(values))
export const useUpdateSpeciality = (id) => useSpecialityMutation((values) => specialitiesClient.update(id, values))
export const useDeleteSpeciality = () => useSpecialityMutation((id) => specialitiesClient.remove(id))
