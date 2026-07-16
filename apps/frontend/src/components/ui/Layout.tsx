import { type ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex h-screen overflow-hidden bg-[#141416]">
    {children}
  </div>
)