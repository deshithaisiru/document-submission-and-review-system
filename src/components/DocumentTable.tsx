import React from 'react';
import { Link } from 'react-router-dom';
import { Document } from '../types';
import { StatusBadge } from './StatusBadge';
import { FileTextIcon, MessageSquareIcon } from 'lucide-react';
interface DocumentTableProps {
  documents: Document[];
}
export function DocumentTable({
  documents
}: DocumentTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  if (documents.length === 0) {
    return <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">No documents found</p>
      </div>;
  }
  return <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comments
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map(doc => <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link to={`/staff/document/${doc.id}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                    <FileTextIcon className="w-4 h-4" />
                    {doc.fileName}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {doc.clientName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {doc.documentType}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(doc.uploadedAt)}
                </td>
                <td className="px-6 py-4">
                  {doc.comments.length > 0 ? <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MessageSquareIcon className="w-4 h-4" />
                      <span>{doc.comments.length}</span>
                    </div> : <span className="text-sm text-gray-400">—</span>}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}