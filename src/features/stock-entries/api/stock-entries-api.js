import { createCrudClient } from '@/core'
import { stockEntryRequestSchema, stockEntrySchema } from '@/features/stock-entries/schemas/stock-entry-schemas'
export const stockEntriesClient = createCrudClient({ basePath: '/stock-entries', itemSchema: stockEntrySchema, requestSchema: stockEntryRequestSchema })
