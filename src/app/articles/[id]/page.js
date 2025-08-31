"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/helper/formatDate";
import { FaArrowLeft, FaCalendarAlt, FaSyncAlt } from "react-icons/fa";
import Markdown from "@/components/Atom/Markdown";

export default function ArticleDetail() {
  const { id } = useParams();
  const articles = useSelector((state) => state.article.articles);
  const router = useRouter();

  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 inline-flex items-center gap-2"
        >
          <FaArrowLeft />
          Kembali
        </button>

        <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
          Artikel tidak ditemukan
        </h1>

        <div className="text-sm text-gray-500 mb-6 space-y-1"></div>

        <div className="prose prose-lg text-justify whitespace-pre-line text-gray-800 text-red-500">
          artikel yang anda cari tidak tersedia.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 inline-flex items-center gap-2"
      >
        <FaArrowLeft />
        Kembali
      </button>

      <img
        src={article.headerImageUrl}
        alt={article.title}
        className="w-full h-72 object-cover rounded-xl mb-6 shadow"
      />

      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
        {article.title}
      </h1>

      <div className="text-sm text-gray-500 mb-6 space-y-1">
        <p className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          Dipublikasikan: {formatDate(new Date(article.createdAt))}
        </p>
        <p className="flex items-center gap-2">
          <FaSyncAlt className="text-gray-400" />
          Diperbarui: {formatDate(new Date(article.updatedAt))}
        </p>
      </div>

      <div className="mt-6">
        <Markdown content={article.content ?? ""} />
      </div>
    </div>
  );
}
