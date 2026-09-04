import { useQuery } from '@tanstack/react-query'

import { getMenuTree } from '@/app/navigation/menu-api'

export const menuKeys = Object.freeze({ tree: ['navigation', 'menu-tree'] })

export function useMenuTree() {
  return useQuery({
    queryKey: menuKeys.tree,
    queryFn: getMenuTree,
    staleTime: 5 * 60_000,
  })
}
