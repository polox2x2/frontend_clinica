import { useState } from 'react'
import { HeartPulse, LogOut, Minus, Plus, RefreshCw } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { useMenuTree } from '@/app/navigation/use-menu-tree'
import { useLogout, useSession } from '@/features/auth'
import { cn } from '@/lib/utils'
import { MenuIcon } from '@/shared/navigation/menu-icons'

// Sub-item: activo => color primario + dot a la izquierda (sin fondo tipo pill).
// El hover conserva el verde en los activos (el base los pintaba oscuros).
const subButtonClass = 'relative transition-colors duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground data-active:bg-transparent data-active:font-medium data-active:text-primary data-active:[&>svg]:text-primary data-active:hover:bg-primary/10 data-active:hover:text-primary data-active:before:absolute data-active:before:top-1/2 data-active:before:-left-3 data-active:before:size-1.5 data-active:before:-translate-y-1/2 data-active:before:rounded-full data-active:before:bg-primary'
// Sección: expandido => texto/ícono primario sin fondo; colapsado => cuadro verde sólido.
const sectionActiveClass = 'transition-colors duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground data-active:bg-transparent data-active:font-semibold data-active:text-primary data-active:[&_svg]:text-primary data-active:hover:bg-primary/10 data-active:hover:text-primary group-data-[collapsible=icon]:data-active:bg-primary group-data-[collapsible=icon]:data-active:text-primary-foreground group-data-[collapsible=icon]:data-active:[&_svg]:text-primary-foreground'
const sectionIconClass = 'shrink-0 text-sidebar-foreground/70 transition-colors group-data-[collapsible=icon]:mx-auto'

function isCurrentRoute(pathname, route) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

const PATIENT_HIDDEN_MENU_LABELS = new Set(['especialidades', 'medicos', 'horarios'])

function normalizedMenuLabel(label) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function hidePatientMenuItems(nodes) {
  return nodes
    .filter((node) => !PATIENT_HIDDEN_MENU_LABELS.has(normalizedMenuLabel(node.label)))
    .map((node) => ({ ...node, children: hidePatientMenuItems(node.children) }))
}

function MenuChildren({ nodes, pathname }) {
  return (
    <SidebarMenuSub>
      {nodes.map((node) => (
        <SidebarMenuSubItem key={node.id}>
          {node.route ? (
            <SidebarMenuSubButton
              className={subButtonClass}
              isActive={isCurrentRoute(pathname, node.route)}
              render={<Link to={node.route} />}
            >
              <MenuIcon name={node.icon} />
              <span>{node.label}</span>
            </SidebarMenuSubButton>
          ) : (
            <span className="px-2 py-1 text-xs text-muted-foreground">{node.label}</span>
          )}
          {node.children.length > 0 && <MenuChildren nodes={node.children} pathname={pathname} />}
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  )
}

function containsCurrentRoute(section, pathname) {
  if (section.route && isCurrentRoute(pathname, section.route)) return true
  return section.children.some((child) => containsCurrentRoute(child, pathname))
}

function MenuSection({ section, pathname, isOpen, onToggle }) {
  const { state, setOpen } = useSidebar()
  const isActive = containsCurrentRoute(section, pathname)
  const hasChildren = section.children.length > 0

  // Hoja (sin hijos): link directo, sin expander.
  if (!hasChildren && section.route) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn('group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!', sectionActiveClass)}
          isActive={isCurrentRoute(pathname, section.route)}
          tooltip={section.label}
          render={<Link to={section.route} />}
        >
          <MenuIcon name={section.icon} className={sectionIconClass} />
          <span className="font-medium group-data-[collapsible=icon]:hidden">{section.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  function handleToggle() {
    if (state === 'collapsed') setOpen(true)
    onToggle(section.id)
  }

  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen}>
        <SidebarMenuButton
          className={cn('group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:p-0!', sectionActiveClass)}
          isActive={isActive}
          tooltip={section.label}
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          <MenuIcon name={section.icon} className={sectionIconClass} />
          <span className="font-medium group-data-[collapsible=icon]:hidden">{section.label}</span>
          {isOpen
            ? <Minus className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            : <Plus className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />}
        </SidebarMenuButton>
        <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-300 ease-out data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0">
          {section.route && (
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton className={subButtonClass} isActive={isCurrentRoute(pathname, section.route)} render={<Link to={section.route} />}>
                  <MenuIcon name={section.icon} />
                  <span>{section.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          )}
          {hasChildren && <MenuChildren nodes={section.children} pathname={pathname} />}
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

export function PortalSidebar() {
  const { pathname } = useLocation()
  const menu = useMenuTree()
  const { data: session } = useSession()
  const logout = useLogout()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const isPatient = session?.roles.includes('Paciente')
  const sections = menu.data && isPatient
    ? [{ id: 'patient-self-service', label: 'Mi espacio', icon: 'heart-pulse', route: null, children: [{ id: 'my-patient-profile', label: 'Mi perfil', icon: 'user-round', route: '/dashboard/mi-perfil', children: [] }] }, ...hidePatientMenuItems(menu.data)]
    : menu.data
  const activeSection = sections?.find((section) => containsCurrentRoute(section, pathname))?.id
  const [selectedSection, setSelectedSection] = useState(undefined)
  const openSection = selectedSection === undefined
    ? (activeSection ?? sections?.[0]?.id ?? null)
    : selectedSection

  function toggleSection(sectionId) {
    setSelectedSection((current) => {
      const resolved = current === undefined ? openSection : current
      return resolved === sectionId ? null : sectionId
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0!"
              size="lg"
              render={<Link to="/dashboard" />}
              tooltip="Clinica Soraka"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-sm transition-transform duration-200 group-hover/menu-button:scale-105">
                <HeartPulse className="size-4.5" strokeWidth={2.25} />
              </span>
              <span className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">Clinica Soraka</span>
                <span className="truncate text-xs text-muted-foreground">Gestión clínica</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menu.isPending && (
          <SidebarGroup>
            <SidebarGroupLabel>Cargando menú</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 6 }, (_, index) => <SidebarMenuSkeleton key={index} showIcon />)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {menu.isError && (
          <SidebarGroup>
            <SidebarGroupLabel>Navegación no disponible</SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <p className="mb-3 text-xs text-muted-foreground">No se pudo cargar el menú.</p>
              <Button className="w-full" size="sm" variant="outline" onClick={() => menu.refetch()}>
                <RefreshCw /> Reintentar
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {sections && (
          <SidebarGroup>
            <SidebarGroupLabel>Menú</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {sections.map((section) => (
                  <MenuSection
                    key={section.id}
                    section={section}
                    pathname={pathname}
                    isOpen={openSection === section.id}
                    onToggle={toggleSection}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-destructive hover:bg-destructive/10 hover:text-destructive active:bg-destructive/10 active:text-destructive"
              tooltip="Cerrar sesión"
              disabled={logout.isPending}
              onClick={() => setConfirmLogout(true)}
            >
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">{logout.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>Tendrás que volver a iniciar sesión para acceder al panel.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => logout.mutate()}>Cerrar sesión</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}
