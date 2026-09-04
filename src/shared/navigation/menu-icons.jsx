import {
  Activity,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarOff,
  Clock,
  FileText,
  KeyRound,
  Menu,
  Package,
  PackagePlus,
  Pill,
  Shield,
  ShoppingCart,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react'

const icons = {
  activity: Activity,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  'calendar-off': CalendarOff,
  clock: Clock,
  'file-text': FileText,
  key: KeyRound,
  menu: Menu,
  package: Package,
  'package-plus': PackagePlus,
  pill: Pill,
  shield: Shield,
  'shopping-cart': ShoppingCart,
  stethoscope: Stethoscope,
  'user-round': UserRound,
  users: Users,
}

export function MenuIcon({ name, ...props }) {
  const Icon = icons[name] ?? Menu
  return <Icon aria-hidden="true" {...props} />
}
