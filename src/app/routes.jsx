import { createBrowserRouter } from 'react-router-dom'

import { AuthGuard } from '@/app/guards/AuthGuard'
import { GuestGuard } from '@/app/guards/GuestGuard'
import { PermissionGuard } from '@/app/guards/PermissionGuard'
import { RoleGuard } from '@/app/guards/RoleGuard'
import { AppLayout } from '@/app/layouts/AppLayout'
import { EntryRedirect } from '@/app/pages/EntryRedirect'
import { RouteErrorBoundary } from '@/app/pages/RouteErrorBoundary'
import { AppLoading } from '@/shared/components/feedback/AppLoading'

const lazyPage = (importer) => async () => {
  const module = await importer()
  return { Component: module.default }
}

const lazyNamedComponent = (importer, exportName) => async () => {
  const module = await importer()
  return { Component: module[exportName] }
}

// Este es el unico registro de rutas. Cada feature agregara aqui sus paginas,
// cargadas bajo demanda y acompanadas por su guard de acceso correspondiente.
export const routes = [
  {
    path: '/',
    Component: AppLayout,
    ErrorBoundary: RouteErrorBoundary,
    HydrateFallback: AppLoading,
    children: [
      {
        index: true,
        Component: EntryRedirect,
      },
      {
        Component: GuestGuard,
        children: [
          {
            path: 'login',
            lazy: lazyPage(() => import('@/features/auth/pages/LoginPage')),
          },
          {
            path: 'registro',
            lazy: lazyPage(() => import('@/features/auth/pages/RegisterPage')),
          },
        ],
      },
      {
        Component: AuthGuard,
        children: [
          {
            path: 'dashboard',
            lazy: lazyNamedComponent(() => import('@/app/layouts/PortalLayout'), 'PortalLayout'),
            children: [
              {
                index: true,
                lazy: lazyPage(() => import('@/app/pages/FoundationPage')),
              },
              {
                element: <PermissionGuard all={['User:List']} />,
                children: [
                  {
                    path: 'usuarios',
                    lazy: lazyPage(() => import('@/features/users/pages/UsersListPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['User:List', 'User:Create', 'Role:List']} />,
                children: [
                  {
                    path: 'usuarios/nuevo',
                    lazy: lazyPage(() => import('@/features/users/pages/UserFormPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['User:Read']} />,
                children: [
                  {
                    path: 'usuarios/:id',
                    lazy: lazyPage(() => import('@/features/users/pages/UserDetailPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['User:Read', 'User:Update', 'Role:List']} />,
                children: [
                  {
                    path: 'usuarios/:id/editar',
                    lazy: lazyPage(() => import('@/features/users/pages/UserFormPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Role:List']} />,
                children: [
                  {
                    path: 'roles',
                    lazy: lazyPage(() => import('@/features/roles/pages/RolesListPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Role:List', 'Role:Create', 'Permission:List']} />,
                children: [
                  {
                    path: 'roles/nuevo',
                    lazy: lazyPage(() => import('@/features/roles/pages/RoleFormPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Role:Read']} />,
                children: [
                  {
                    path: 'roles/:id',
                    lazy: lazyPage(() => import('@/features/roles/pages/RoleDetailPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Role:Read', 'Role:Update', 'Permission:List']} />,
                children: [
                  {
                    path: 'roles/:id/editar',
                    lazy: lazyPage(() => import('@/features/roles/pages/RoleFormPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Permission:List']} />,
                children: [
                  {
                    path: 'permisos',
                    lazy: lazyPage(() => import('@/features/permissions/pages/PermissionsListPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Permission:List', 'Permission:Create']} />,
                children: [
                  {
                    path: 'permisos/nuevo',
                    lazy: lazyPage(() => import('@/features/permissions/pages/PermissionFormPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Permission:Read']} />,
                children: [
                  {
                    path: 'permisos/:id',
                    lazy: lazyPage(() => import('@/features/permissions/pages/PermissionDetailPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Permission:Read', 'Permission:Update']} />,
                children: [
                  {
                    path: 'permisos/:id/editar',
                    lazy: lazyPage(() => import('@/features/permissions/pages/PermissionFormPage')),
                  },
                ],
              },
              {
                element: <PermissionGuard all={['Menu:List']} />,
                children: [{ path: 'menus', lazy: lazyPage(() => import('@/features/menus/pages/MenusListPage')) }],
              },
              {
                element: <PermissionGuard all={['Menu:List', 'Menu:Create', 'Permission:List']} />,
                children: [{ path: 'menus/nuevo', lazy: lazyPage(() => import('@/features/menus/pages/MenuFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Menu:Read']} />,
                children: [{ path: 'menus/:id', lazy: lazyPage(() => import('@/features/menus/pages/MenuDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Menu:Read', 'Menu:Update', 'Menu:List', 'Permission:List']} />,
                children: [{ path: 'menus/:id/editar', lazy: lazyPage(() => import('@/features/menus/pages/MenuFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Speciality:List']} />,
                children: [{ path: 'especialidades', lazy: lazyPage(() => import('@/features/specialities/pages/SpecialitiesListPage')) }],
              },
              {
                element: <PermissionGuard all={['Speciality:List', 'Speciality:Create']} />,
                children: [{ path: 'especialidades/nuevo', lazy: lazyPage(() => import('@/features/specialities/pages/SpecialityFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Speciality:Read']} />,
                children: [{ path: 'especialidades/:id', lazy: lazyPage(() => import('@/features/specialities/pages/SpecialityDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Speciality:Read', 'Speciality:Update', 'Speciality:List']} />,
                children: [{ path: 'especialidades/:id/editar', lazy: lazyPage(() => import('@/features/specialities/pages/SpecialityFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Doctor:List']} />,
                children: [{ path: 'medicos', lazy: lazyPage(() => import('@/features/doctors/pages/DoctorsListPage')) }],
              },
              {
                element: <PermissionGuard all={['Doctor:List', 'Doctor:Create', 'Speciality:List']} />,
                children: [{ path: 'medicos/nuevo', lazy: lazyPage(() => import('@/features/doctors/pages/DoctorFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Doctor:Read']} />,
                children: [{ path: 'medicos/:id', lazy: lazyPage(() => import('@/features/doctors/pages/DoctorDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Doctor:Read', 'Doctor:Update', 'Speciality:List']} />,
                children: [{ path: 'medicos/:id/editar', lazy: lazyPage(() => import('@/features/doctors/pages/DoctorFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Patient:List']} />,
                children: [{ path: 'pacientes', lazy: lazyPage(() => import('@/features/patients/pages/PatientsListPage')) }],
              },
              {
                element: <PermissionGuard all={['Patient:Create']} />,
                children: [{ path: 'pacientes/nuevo', lazy: lazyPage(() => import('@/features/patients/pages/PatientFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Patient:Read']} />,
                children: [{ path: 'pacientes/:id', lazy: lazyPage(() => import('@/features/patients/pages/PatientDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Patient:Read', 'Patient:Update']} />,
                children: [{ path: 'pacientes/:id/editar', lazy: lazyPage(() => import('@/features/patients/pages/PatientFormPage')) }],
              },
              {
                element: <RoleGuard role="Paciente" />,
                children: [{ path: 'mi-perfil', lazy: lazyPage(() => import('@/features/patients/pages/MyPatientProfilePage')) }],
              },
              {
                element: <PermissionGuard all={['Product:List']} />,
                children: [{ path: 'productos', lazy: lazyPage(() => import('@/features/products/pages/ProductsListPage')) }],
              },
              {
                element: <PermissionGuard all={['Product:Create']} />,
                children: [{ path: 'productos/nuevo', lazy: lazyPage(() => import('@/features/products/pages/ProductFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Product:Read']} />,
                children: [{ path: 'productos/:id', lazy: lazyPage(() => import('@/features/products/pages/ProductDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Product:Read', 'Product:Update']} />,
                children: [{ path: 'productos/:id/editar', lazy: lazyPage(() => import('@/features/products/pages/ProductFormPage')) }],
              },
              {
                element: <PermissionGuard all={['StockEntry:List']} />,
                children: [{ path: 'entradas', lazy: lazyPage(() => import('@/features/stock-entries/pages/StockEntriesListPage')) }],
              },
              {
                element: <PermissionGuard all={['StockEntry:Create', 'Product:List']} />,
                children: [{ path: 'entradas/nueva', lazy: lazyPage(() => import('@/features/stock-entries/pages/StockEntryFormPage')) }],
              },
              {
                element: <PermissionGuard all={['StockEntry:Read']} />,
                children: [{ path: 'entradas/:id', lazy: lazyPage(() => import('@/features/stock-entries/pages/StockEntryDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Order:List']} />,
                children: [{ path: 'ventas', lazy: lazyPage(() => import('@/features/orders/pages/OrdersListPage')) }],
              },
              {
                element: <PermissionGuard all={['Order:Create', 'Product:List']} />,
                children: [{ path: 'ventas/nueva', lazy: lazyPage(() => import('@/features/orders/pages/OrderFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Order:Read']} />,
                children: [{ path: 'ventas/:id', lazy: lazyPage(() => import('@/features/orders/pages/OrderDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Availability:List']} />,
                children: [{ path: 'disponibilidad', lazy: lazyPage(() => import('@/features/availability/pages/AvailabilityListPage')) }],
              },
              {
                element: <PermissionGuard all={['Availability:Create', 'Doctor:List']} />,
                children: [{ path: 'disponibilidad/nueva', lazy: lazyPage(() => import('@/features/availability/pages/AvailabilityFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Availability:Read']} />,
                children: [{ path: 'disponibilidad/:id', lazy: lazyPage(() => import('@/features/availability/pages/AvailabilityDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Availability:Read', 'Availability:Update', 'Doctor:List']} />,
                children: [{ path: 'disponibilidad/:id/editar', lazy: lazyPage(() => import('@/features/availability/pages/AvailabilityFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Absence:List']} />,
                children: [{ path: 'ausencias', lazy: lazyPage(() => import('@/features/absences/pages/AbsencesListPage')) }],
              },
              {
                element: <PermissionGuard all={['Absence:Create']} />,
                children: [{ path: 'ausencias/nueva', lazy: lazyPage(() => import('@/features/absences/pages/AbsenceFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Absence:Read']} />,
                children: [{ path: 'ausencias/:id', lazy: lazyPage(() => import('@/features/absences/pages/AbsenceDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Absence:Read', 'Absence:Update', 'Doctor:List']} />,
                children: [{ path: 'ausencias/:id/editar', lazy: lazyPage(() => import('@/features/absences/pages/AbsenceFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Schedule:List']} />,
                children: [{ path: 'horarios', lazy: lazyPage(() => import('@/features/schedules/pages/SchedulesListPage')) }],
              },
              {
                element: <PermissionGuard all={['Schedule:Create']} />,
                children: [
                  { path: 'horarios/nuevo', lazy: lazyPage(() => import('@/features/schedules/pages/ScheduleFormPage')) },
                  { path: 'horarios/generar', lazy: lazyPage(() => import('@/features/schedules/pages/GenerateSchedulesPage')) },
                ],
              },
              {
                element: <PermissionGuard all={['Schedule:Read']} />,
                children: [{ path: 'horarios/:id', lazy: lazyPage(() => import('@/features/schedules/pages/ScheduleDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['Schedule:Read', 'Schedule:Update']} />,
                children: [{ path: 'horarios/:id/editar', lazy: lazyPage(() => import('@/features/schedules/pages/ScheduleFormPage')) }],
              },
              {
                element: <PermissionGuard all={['Calendar:Read']} />,
                children: [{ path: 'agenda', lazy: lazyPage(() => import('@/features/calendar/pages/CalendarPage')) }],
              },
              {
                element: <PermissionGuard all={['Appointment:List']} />,
                children: [{ path: 'citas', lazy: lazyPage(() => import('@/features/appointments/pages/AppointmentsPage')) }],
              },
              {
                element: <PermissionGuard all={['Appointment:Create', 'Doctor:List', 'Schedule:List']} />,
                children: [{ path: 'citas/nueva', lazy: lazyPage(() => import('@/features/appointments/pages/BookAppointmentPage')) }],
              },
              {
                element: <PermissionGuard all={['Appointment:Read']} />,
                children: [{ path: 'citas/:id', lazy: lazyPage(() => import('@/features/appointments/pages/AppointmentDetailPage')) }],
              },
              {
                element: <PermissionGuard all={['MedicalRecord:Read']} />,
                children: [
                  { path: 'historias', lazy: lazyPage(() => import('@/features/medical-records/pages/MedicalRecordsPage')) },
                  { path: 'historias/:patientId', lazy: lazyPage(() => import('@/features/medical-records/pages/MedicalRecordDetailPage')) },
                ],
              },
              {
                element: <PermissionGuard all={['MedicalRecord:Create']} />,
                children: [{ path: 'historias/:patientId/nueva', lazy: lazyPage(() => import('@/features/medical-records/pages/MedicalEntryFormPage')) }],
              },
            ],
          },
          {
            path: 'sin-acceso',
            lazy: lazyPage(() => import('@/app/pages/ForbiddenPage')),
          },
        ],
      },
      {
        path: '*',
        lazy: lazyPage(() => import('@/app/pages/NotFoundPage')),
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
