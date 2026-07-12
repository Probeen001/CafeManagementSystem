import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../services/orderService'

const KEY = ['orders']

function normalizeStatusForUi(status) {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized === 'new') return 'pending'
  return normalized
}

function normalizeStatusForApi(status) {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized === 'pending') return 'new'
  return normalized
}

function normalizeOrder(order) {
  if (!order) return order
  return { ...order, order_status: normalizeStatusForUi(order.order_status) }
}

function normalizeOrders(data) {
  if (!Array.isArray(data)) return []
  return data.map(normalizeOrder)
}

export function useOrders(params) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => orderService.getAll(params).then((r) => normalizeOrders(r.data.orders ?? r.data)),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  })
}

export function useOrder(id) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => orderService.getById(id).then((r) => normalizeOrder(r.data.order ?? r.data)),
    enabled: Boolean(id),
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => orderService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, normalizeStatusForApi(status)),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => orderService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useCreatePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, ...data }) => orderService.createPayment(orderId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
