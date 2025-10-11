"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ArticleCarousel() {
  const articles = useSelector((state) => state.article.articles);
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Artikel Terbaru</h2>

      {articles.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Belum ada artikel yang tersedia.
        </div>
      ) : (
        <Swiper
          className="w-full"
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: true }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Autoplay]}
        >
          {articles.map((article) => (
            <SwiperSlide key={article.id} className="!h-auto">
              <div
                onClick={() => router.push(`/articles/${article.id}`)}
                className="cursor-pointer flex flex-col h-full rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={article.headerImageUrl}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />

                {/* Body needs to stretch to keep cards equal height */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Title: clamp to 2 lines and lock the block height */}
                  <h3 className="text-lg font-semibold mb-2 leading-snug line-clamp-2 min-h-[3.5rem]">
                    {article.title}
                  </h3>

                  {/* Description: clamp to 3 lines and lock the block height */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 min-h-[3.75rem]">
                    {article.content}
                  </p>

                  {/* Optional: footer row (date/tags/CTA) pinned to bottom */}
                  {/* <div className="mt-auto pt-3 text-xs text-gray-500">…</div> */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
