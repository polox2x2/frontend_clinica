import { httpClient } from '@/core/api/http-client'
import { menuTreeSchema } from '@/shared/navigation/menu-contract'

export async function getMenuTree() {
  const { data } = await httpClient.get('/menus/tree')
  return menuTreeSchema.parse(data)
}
