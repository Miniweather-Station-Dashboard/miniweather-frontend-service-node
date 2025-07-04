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
          className="max-w-[80vw]"
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
            <SwiperSlide key={article.id}>
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
                  <h3 className="text-lg font-semibold mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.content}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
