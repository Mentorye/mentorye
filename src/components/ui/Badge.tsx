interface BadgeProps {
  children: React.ReactNode
  color?: 'indigo' | 'green' | 'yellow' | 'red' | 'gray'
}

export function Badge({ children, color = 'indigo' }: BadgeProps) {
  const colors = {
    indigo: 'bg-primary-100 text-primary-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
