import { type ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export const MainContent = ({ children }: MainContentProps) => (
  <div className="flex flex-col overflow-hidden flex-1">
    {children}
  </div>
)