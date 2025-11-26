import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { ClientLayout } from '../../components/ClientLayout';
import { DocumentCard } from '../../components/DocumentCard';
import { Button } from '../../components/Button';
import { UploadIcon, FileTextIcon } from 'lucide-react';
export function ClientDashboard() {
  const {
    user
  } = useAuth();
  const {
    getClientDocuments
  } = useDocuments();
  const myDocuments = user ? getClientDocuments(user.id) : [];
  return <ClientLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="text-gray-600 mt-1">
              Track and manage your document submissions
            </p>
          </div>
          <Link to="/client/upload">
            <Button>
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>

      {myDocuments.length === 0 ? <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <FileTextIcon className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No documents yet
          </h3>
          <p className="text-gray-600 mb-6">
            Upload your first document to get started. We'll review it within 24
            hours.
          </p>
          <Link to="/client/upload">
            <Button>
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Your First Document
            </Button>
          </Link>
        </div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myDocuments.map(doc => <DocumentCard key={doc.id} document={doc} />)}
        </div>}
    </ClientLayout>;
}
//just committ 
//just committ 2