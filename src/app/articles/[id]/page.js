"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

export default function ArticleDetail() {
  const { id } = useParams();
  const articles = useSelector((state) => state.article.articles);
  const router = useRouter();

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Artikel tidak ditemukan</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        Kembali
      </button>

      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <img
        src={article.headerImageUrl}
        alt={article.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <p className="text-gray-700 text-lg leading-relaxed">{article.content}</p>
    </div>
  );
}
