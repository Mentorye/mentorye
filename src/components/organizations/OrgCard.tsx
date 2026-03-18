import { Link } from 'react-router-dom'
import type { Organization } from '@/types'
import { Badge } from '@/components/ui/Badge'

const typeLabels: Record<string, string> = {
  church: 'Igreja',
  ngo: 'ONG',
  counseling: 'Aconselhamento',
  other: 'Mentor',
}

interface OrgCardProps {
  org: Organization
}

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link
      to={`/org/${org.id}`}
      className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
    >
      <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
        {org.logo_url ? (
          <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🏢</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition truncate">
            {org.name}
          </h3>
          <Badge color="indigo">{typeLabels[org.type] ?? 'Mentor'}</Badge>
        </div>
        {org.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{org.description}</p>
        )}
      </div>

      <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-400 transition shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
