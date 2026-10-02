import type { ElementType, ReactNode } from 'react'

interface Props {
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Container({ as: Tag = 'div', className = '', children }: Props) {
  return (
    <Tag className={`mx-auto w-full max-w-[80rem] px-5 sm:px-8 lg:px-12 3xl:max-w-[92rem] ${className}`}>
      {children}
    </Tag>
  )
}
