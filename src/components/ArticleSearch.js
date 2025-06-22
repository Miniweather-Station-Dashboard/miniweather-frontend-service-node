"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ArticleCard from "@/components/Atom/ArticleCard";
import {
  setSearchResults,
  setSearchLoading,
  setError,
} from "@/redux/slices/articleSlice";

export default function ArticleSearch() {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.searchResults);
  const loading = useSelector((state) => state.article.searchLoading);

  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() === "") {
        dispatch(setSearchResults([]));
        return;
      }

      const fetchArticles = async () => {
        try {
          const apiUrl = `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/v1/articles?page=1&limit=2&is_published=false&search=${encodeURIComponent(
            query
          )}`;
          const headers = { "Content-Type": "application/json" };

          dispatch(setSearchLoading("pending"));
          const res = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to fetch articles");
          }

          const result = await res.json();

          dispatch(setSearchResults(result.data.articles || []));
          dispatch(setSearchLoading("succeeded"));
        } catch (error) {
          dispatch(setError(error.message));
          dispatch(setSearchLoading("failed"));
        }
      };

      fetchArticles();
    }, 500); // Debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query, dispatch]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-8">
      <h2 className="text-xl font-semibold mb-4">Cari Artikel</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari berdasarkan judul artikel..."
        className="w-full p-2 border border-gray-300 rounded-md mb-6 focus:ring-blue-500 focus:border-blue-500"
      />

      {loading === "pending" && (
        <p className="text-gray-500 italic mb-4">Mencari artikel...</p>
      )}

      {articles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : loading !== "pending" && query.trim() !== "" ? (
        <p className="text-gray-500 italic">Artikel tidak ditemukan.</p>
      ) : null}
    </div>
  );
}
