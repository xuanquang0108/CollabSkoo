// components/documents/DocumentCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface DocumentCardProps {
  document: {
    id: number;
    title: string;
    thumbnail: string;
    category: string;
    documentType: string;
  };
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={document.thumbnail || '/images/default-thumbnail.png'}
          alt={document.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {document.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{document.category}</span>
          <span>{document.documentType}</span>
        </div>
        <Link
          href={`/documents/${document.id}`}
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}