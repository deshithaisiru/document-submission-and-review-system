import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { ClientLayout } from '../../components/ClientLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { CommentThread } from '../../components/CommentThread';
import { FileUpload } from '../../components/FileUpload';
import { Textarea } from '../../components/Textarea';
import { Button } from '../../components/Button';
import { ArrowLeftIcon, FileTextIcon, CalendarIcon, DownloadIcon, UploadIcon } from 'lucide-react';
export function DocumentDetail() {
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
    addComment,
    addDocument
  } = useDocuments();
  const navigate = useNavigate();
  const document = id ? getDocument(id) : undefined;
  const [newComment, setNewComment] = useState('');
  const [isReuploading, setIsReuploading] = useState(false);
  const [reuploadFile, setReuploadFile] = useState<File | null>(null);
  if (!document) {
    return <ClientLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Document not found</p>
          <Button onClick={() => navigate('/client/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </ClientLayout>;
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
  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addComment(document.id, {
      authorId: user.id,
      authorName: user.name,
      authorRole: 'client',
      text: newComment.trim()
    });
    setNewComment('');
  };
  const handleReupload = () => {
    if (!reuploadFile || !user) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      addDocument({
        clientId: user.id,
        clientName: user.name,
        fileName: reuploadFile.name,
        fileType: reuploadFile.type,
        fileSize: reuploadFile.size,
        fileData: base64,
        documentType: document.documentType,
        period: document.period,
        notes: `Reupload of: ${document.fileName}`,
        status: 'pending'
      });
      navigate('/client/dashboard');
    };
    reader.readAsDataURL(reuploadFile);
  };
  const canReupload = document.status === 'needs_correction';
  return <ClientLayout>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/client/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <FileTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {document.fileName}
                  </h1>
                  <p className="text-gray-600 mt-1">{document.documentType}</p>
                </div>
              </div>
              <StatusBadge status={document.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Uploaded:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {formatDate(document.uploadedAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 text-gray-900 font-medium">
                  {formatDate(document.updatedAt)}
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

          {/* Notes */}
          {document.notes && <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-900">{document.notes}</p>
            </div>}

          {/* Comments */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments & Feedback
            </h3>
            <CommentThread comments={document.comments} />

            <div className="mt-6">
              <Textarea placeholder="Add a comment or question..." rows={3} value={newComment} onChange={e => setNewComment(e.target.value)} />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Add Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Reupload Section */}
          {canReupload && <div className="p-6 bg-orange-50 border-b border-orange-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <UploadIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Correction Required
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Please review the staff comments and upload a corrected
                    version of your document.
                  </p>
                </div>
              </div>

              {!isReuploading ? <Button onClick={() => setIsReuploading(true)} variant="primary">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Corrected Document
                </Button> : <div className="space-y-4">
                  <FileUpload onFileSelect={setReuploadFile} />
                  <div className="flex gap-3">
                    <Button onClick={handleReupload} disabled={!reuploadFile}>
                      Submit Corrected Document
                    </Button>
                    <Button variant="outline" onClick={() => setIsReuploading(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>}
            </div>}

          {/* Actions */}
          <div className="p-6 bg-gray-50">
            <Button variant="outline" className="w-full" disabled>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download Document
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Download functionality available in production
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>;
}