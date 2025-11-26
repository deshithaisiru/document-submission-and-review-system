import React from 'react';
import { DocumentStatus } from '../types';
interface StatusBadgeProps {
  status: DocumentStatus;
}
export function StatusBadge({
  status
}: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending Review',
      className: 'bg-gray-100 text-gray-700 border-gray-300'
    },
    in_review: {
      label: 'In Review',
      className: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    needs_correction: {
      label: 'Needs Correction',
      className: 'bg-orange-100 text-orange-700 border-orange-300'
    },
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-700 border-green-300'
    }
  };
  const config = statusConfig[status];
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
      {config.label}
    </span>;
}