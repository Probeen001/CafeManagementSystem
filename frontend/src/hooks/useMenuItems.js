import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { menuService } from '../services/menuService'

const KEY = ['menu']

export function useMenuItems(params) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => menuService.getAll(params).then((r) => r.data.items ?? r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => menuService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => menuService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => menuService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useToggleAvailability() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => menuService.toggleAvailability(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
