import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';
import { ClientLayout } from '../../components/ClientLayout';
import { FileUpload } from '../../components/FileUpload';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Textarea } from '../../components/Textarea';
import { Button } from '../../components/Button';
export function UploadDocument() {
  const {
    user
  } = useAuth();
  const {
    addDocument
  } = useDocuments();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [period, setPeriod] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const documentTypes = [{
    value: '',
    label: 'Select document type'
  }, {
    value: 'Invoice',
    label: 'Invoice'
  }, {
    value: 'Statement',
    label: 'Statement'
  }, {
    value: 'Compliance Document',
    label: 'Compliance Document'
  }, {
    value: 'Project File',
    label: 'Project File'
  }, {
    value: 'Contract',
    label: 'Contract'
  }, {
    value: 'Report',
    label: 'Report'
  }, {
    value: 'Other',
    label: 'Other'
  }];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !documentType || !user) return;
    setLoading(true);
    // Convert file to base64 for demo storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      addDocument({
        clientId: user.id,
        clientName: user.name,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileData: base64,
        documentType,
        period,
        notes,
        status: 'pending'
      });
      setLoading(false);
      navigate('/client/dashboard');
    };
    reader.readAsDataURL(file);
  };
  return <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Document</h1>
          <p className="text-gray-600 mt-1">
            Submit your document for review. We'll get back to you within 24
            hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File *
            </label>
            <FileUpload onFileSelect={setFile} />
          </div>

          <Select label="Document Type *" options={documentTypes} value={documentType} onChange={e => setDocumentType(e.target.value)} required />

          <Input type="text" label="Period (Optional)" placeholder="e.g., Q1 2024, January 2024" value={period} onChange={e => setPeriod(e.target.value)} />

          <Textarea label="Notes (Optional)" placeholder="Add any additional information or context..." rows={4} value={notes} onChange={e => setNotes(e.target.value)} />

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={!file || !documentType || loading} className="flex-1">
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/client/dashboard')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ClientLayout>;
}