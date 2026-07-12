import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService'

const KEY = ['categories']

export function useCategories() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => categoryService.getAll().then((r) => r.data.categories ?? r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => categoryService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => categoryService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
