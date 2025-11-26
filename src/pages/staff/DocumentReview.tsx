import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { StaffLayout } from '../../components/StaffLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { CommentThread } from '../../components/CommentThread';
import { Select } from '../../components/Select';
import { Textarea } from '../../components/Textarea';
import { Button } from '../../components/Button';
import { ArrowLeftIcon, FileTextIcon, UserIcon, CalendarIcon, SaveIcon } from 'lucide-react';
import { DocumentStatus } from '../../types';
export function DocumentReview() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    user
  } = useAuth();
  const {
    getDocument,
    updateDocumentStatus,
    addComment
  } = useDocuments();
  const navigate = useNavigate();
  const document = id ? getDocument(id) : undefined;
  const [status, setStatus] = useState<DocumentStatus>(document?.status || 'pending');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  if (!document) {
    return <StaffLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Document not found</p>
          <Button onClick={() => navigate('/staff/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </StaffLayout>;
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  const statusOptions = [{
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
  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    // Update status if changed
    if (status !== document.status) {
      updateDocumentStatus(document.id, status, user.name);
    }
    // Add comment if provided
    if (comment.trim()) {
      addComment(document.id, {
        authorId: user.id,
        authorName: user.name,
        authorRole: 'staff',
        text: comment.trim()
      });
      setComment('');
    }
    setSaving(false);
    // Show success feedback
    setTimeout(() => {
      navigate('/staff/dashboard');
    }, 500);
  };
  return <StaffLayout>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/staff/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <FileTextIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {document.fileName}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {document.documentType}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Client:</span>
                    <span className="text-gray-900 font-medium">
                      {document.clientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(document.uploadedAt)}
                    </span>
                  </div>
                  {document.period && <div>
                      <span className="text-gray-600">Period:</span>
                      <span className="ml-2 text-gray-900 font-medium">
                        {document.period}
                      </span>
                    </div>}
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 text-gray-900 font-medium">
                      {formatFileSize(document.fileSize)}
                    </span>
                  </div>
                </div>
              </div>

              {document.notes && <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Client Notes
                  </h3>
                  <p className="text-gray-900">{document.notes}</p>
                </div>}

              {/* Comments */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Communication History
                </h3>
                <CommentThread comments={document.comments} />
              </div>
            </div>
          </div>

          {/* Sidebar - Review Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Actions
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <StatusBadge status={document.status} />
                </div>

                <Select label="Update Status" options={statusOptions} value={status} onChange={e => setStatus(e.target.value as DocumentStatus)} />

                <Textarea label="Add Comment" placeholder="Provide feedback or request corrections..." rows={6} value={comment} onChange={e => setComment(e.target.value)} />

                <div className="pt-4 space-y-3">
                  <Button onClick={handleSave} className="w-full" disabled={saving || status === document.status && !comment.trim()}>
                    <SaveIcon className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>

                  {status === 'needs_correction' && !comment.trim() && <p className="text-xs text-orange-600">
                      Please add a comment explaining what needs to be corrected
                    </p>}

                  {status === 'approved' && <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-800">
                        Client will be notified of approval
                      </p>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>;
}