import { type ReactNode } from 'react'

interface AsideProps {
  children: ReactNode
}

export const Aside = ({ children }: AsideProps) => (
  <aside className="w-60 min-w-60 border-r border-[#2a2a2e] flex flex-col overflow-hidden">
    {children}
  </aside>
)