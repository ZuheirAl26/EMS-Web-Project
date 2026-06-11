import type { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="ems-app">{children}</div>
}
