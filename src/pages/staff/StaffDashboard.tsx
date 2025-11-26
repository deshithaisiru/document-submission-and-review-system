import React, { useState } from 'react';
import { useDocuments } from '../../context/DocumentContext';
import { StaffLayout } from '../../components/StaffLayout';
import { DocumentTable } from '../../components/DocumentTable';
import { Select } from '../../components/Select';
import { DocumentStatus } from '../../types';
import { FileTextIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
export function StaffDashboard() {
  const {
    documents
  } = useDocuments();
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const filteredDocuments = statusFilter === 'all' ? documents : documents.filter(doc => doc.status === statusFilter);
  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    inReview: documents.filter(d => d.status === 'in_review').length,
    needsCorrection: documents.filter(d => d.status === 'needs_correction').length,
    approved: documents.filter(d => d.status === 'approved').length
  };
  const statusOptions = [{
    value: 'all',
    label: 'All Documents'
  }, {
    value: 'pending',
    label: 'Pending Review'
  }, {
    value: 'in_review',
    label: 'In Review'
  }, {
    value: 'needs_correction',
    label: 'Needs Correction'
  }, {
    value: 'approved',
    label: 'Approved'
  }];
  return <StaffLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Review</h1>
        <p className="text-gray-600 mt-1">
          Review and manage client document submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <FileTextIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pending}
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-lg p-5 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Needs Correction</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {stats.needsCorrection}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertCircleIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-lg p-5 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {stats.approved}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Select options={statusOptions} value={statusFilter} onChange={e => setStatusFilter(e.target.value as DocumentStatus | 'all')} className="w-64" />
          <p className="text-sm text-gray-600">
            Showing {filteredDocuments.length}{' '}
            {filteredDocuments.length === 1 ? 'document' : 'documents'}
          </p>
        </div>
      </div>

      {/* Documents Table */}
      <DocumentTable documents={filteredDocuments} />
    </StaffLayout>;
}