import { DashboardPage } from '../features/dashboard/pages'
import { DashboardLayout } from '../layouts'

export function AppRouter() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  )
}
