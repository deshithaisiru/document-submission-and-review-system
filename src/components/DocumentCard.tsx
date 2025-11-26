import React from 'react';
import { Link } from 'react-router-dom';
import { Document } from '../types';
import { StatusBadge } from './StatusBadge';
import { FileTextIcon, ClockIcon, MessageSquareIcon } from 'lucide-react';
interface DocumentCardProps {
  document: Document;
}
export function DocumentCard({
  document
}: DocumentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const hasNewComments = document.comments.length > 0 && document.comments[document.comments.length - 1].authorRole === 'staff';
  return <Link to={`/client/document/${document.id}`} className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <FileTextIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{document.fileName}</h3>
            <p className="text-sm text-gray-600">{document.documentType}</p>
          </div>
        </div>
        <StatusBadge status={document.status} />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" />
          <span>{formatDate(document.uploadedAt)}</span>
        </div>
        {document.comments.length > 0 && <div className="flex items-center gap-1">
            <MessageSquareIcon className="w-4 h-4" />
            <span className={hasNewComments ? 'font-medium text-blue-600' : ''}>
              {document.comments.length}{' '}
              {document.comments.length === 1 ? 'comment' : 'comments'}
            </span>
          </div>}
      </div>

      {document.period && <div className="mt-2 text-sm text-gray-600">
          Period: {document.period}
        </div>}
    </Link>;
}