import { createCrudClient } from '@/core'
import { permissionRequestSchema, permissionSchema } from '@/features/permissions/schemas/permission-schemas'

export const permissionsClient = createCrudClient({
  basePath: '/permissions',
  itemSchema: permissionSchema,
  requestSchema: permissionRequestSchema,
})
