export type DocumentStatus = 'pending' | 'in_review' | 'needs_correction' | 'approved';
export type UserRole = 'client' | 'staff';
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
export interface Document {
  id: string;
  clientId: string;
  clientName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData?: string; // base64 for demo
  documentType: string;
  period: string;
  notes: string;
  status: DocumentStatus;
  uploadedAt: string;
  updatedAt: string;
  comments: Comment[];
}
export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}
export interface StatusHistoryItem {
  status: DocumentStatus;
  timestamp: string;
  updatedBy: string;
}