import React from 'react';
import { Comment } from '../types';
import { MessageSquareIcon, UserIcon } from 'lucide-react';
interface CommentThreadProps {
  comments: Comment[];
}
export function CommentThread({
  comments
}: CommentThreadProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  if (comments.length === 0) {
    return <div className="text-center py-8 text-gray-500">
        <MessageSquareIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No comments yet</p>
      </div>;
  }
  return <div className="space-y-4">
      {comments.map(comment => <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${comment.authorRole === 'staff' ? 'bg-blue-100' : 'bg-gray-200'}`}>
              <UserIcon className={`w-4 h-4 ${comment.authorRole === 'staff' ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {comment.authorName}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${comment.authorRole === 'staff' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                  {comment.authorRole === 'staff' ? 'Staff' : 'Client'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        </div>)}
    </div>;
}