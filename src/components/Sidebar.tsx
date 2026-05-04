'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  role: 'admin' | 'investor'
  name: string
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'ダッシュボード' },
  { href: '/admin/investors', label: '出資者管理' },
  { href: '/admin/distributions', label: '分配金管理' },
  { href: '/admin/contracts', label: '契約管理' },
]

const investorLinks = [
  { href: '/dashboard', label: 'ダッシュボード' },
  { href: '/distributions', label: '分配金履歴' },
  { href: '/contracts', label: '契約情報' },
]

export default function Sidebar({ role, name }: SidebarProps) {
  const pathname = usePathname()
  const links = role === 'admin' ? adminLinks : investorLinks

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <p className="text-xs text-gray-400 mb-1">匿名組合管理</p>
        <p className="font-semibold text-sm truncate">{name}</p>
        <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block bg-blue-600">
          {role === 'admin' ? '管理者' : '出資者'}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
        >
          ログアウト
        </button>
      </div>
    </aside>
  )
}
