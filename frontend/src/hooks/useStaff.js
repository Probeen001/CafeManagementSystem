import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { staffService } from '../services/staffService'

const KEY = ['staff']

export function useStaff(params) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => staffService.getAll(params).then((r) => r.data.staff ?? r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => staffService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => staffService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useToggleStaffActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => staffService.toggleActive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => staffService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
