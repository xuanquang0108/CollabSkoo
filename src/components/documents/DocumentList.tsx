// components/documents/DocumentList.tsx
'use client';

import { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard';

interface Document {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  documentType: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch from your API
    const fetchDocuments = async () => {
      try {
        // Simulate API call
        const response = await fetch('/api/documents');
        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
}