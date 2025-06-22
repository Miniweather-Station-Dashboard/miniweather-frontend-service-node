"use client";

import { useRouter } from "next/navigation";

export default function ArticleCard({ article }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/articles/${article.id}`)}
      className="cursor-pointer flex flex-col h-full rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={article.headerImageUrl}
        alt={article.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{article.content}</p>
      </div>
    </div>
  );
}
