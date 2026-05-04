import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" name={session.user?.name ?? ''} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
