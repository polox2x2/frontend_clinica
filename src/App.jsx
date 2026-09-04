import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/routes'
import { AppLoading } from '@/shared/components/feedback/AppLoading'

export default function App() {
  return <RouterProvider router={router} fallbackElement={<AppLoading />} />
}
