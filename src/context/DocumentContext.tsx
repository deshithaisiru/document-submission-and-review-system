import React, { useEffect, useState, createContext, useContext } from 'react';
import { Document, Comment, DocumentStatus } from '../types';
interface DocumentContextType {
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'updatedAt' | 'comments'>) => void;
  updateDocumentStatus: (docId: string, status: DocumentStatus, staffName: string) => void;
  addComment: (docId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getDocument: (docId: string) => Document | undefined;
  getClientDocuments: (clientId: string) => Document[];
}
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);
export function DocumentProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  useEffect(() => {
    const savedDocs = localStorage.getItem('documents');
    if (savedDocs) {
      setDocuments(JSON.parse(savedDocs));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);
  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt' | 'updatedAt' | 'comments'>) => {
    const newDoc: Document = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    setDocuments(prev => [newDoc, ...prev]);
  };
  const updateDocumentStatus = (docId: string, status: DocumentStatus, staffName: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return doc;
    }));
  };
  const addComment = (docId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const newComment: Comment = {
          ...comment,
          id: `comment-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        return {
          ...doc,
          comments: [...doc.comments, newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return doc;
    }));
  };
  const getDocument = (docId: string) => {
    return documents.find(doc => doc.id === docId);
  };
  const getClientDocuments = (clientId: string) => {
    return documents.filter(doc => doc.clientId === clientId);
  };
  return <DocumentContext.Provider value={{
    documents,
    addDocument,
    updateDocumentStatus,
    addComment,
    getDocument,
    getClientDocuments
  }}>
      {children}
    </DocumentContext.Provider>;
}
export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentProvider');
  }
  return context;
}