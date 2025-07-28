"use client";
import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Search, Film, Star, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { searchMovies } from "@/utils/api";
import debounce from "lodash.debounce";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface SearchResponse {
  Response: "True" | "False";
  Search?: Movie[];
  Error?: string;
}

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMovies = useMemo(
    () =>
      debounce(async (search: string) => {
        if (!search.trim()) {
          setMovies([]);
          setError("");
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        try {
          const data: SearchResponse = await searchMovies(search);
          if (data.Response === "True" && data.Search) {
            setMovies(data.Search);
            setError("");
          } else {
            setMovies([]);
            setError(data.Error || "لم يتم العثور على أفلام");
          }
        } catch (err: unknown) {
          setError(
            err instanceof Error
              ? err.message.includes("429")
                ? "تم الوصول إلى الحد الأقصى للطلبات. حاول لاحقًا."
                : "حدث خطأ أثناء الاتصال"
              : "خطأ غير معروف"
          );
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }, 500),
    []
  );

  useEffect(() => {
    fetchMovies(query);
    return () => fetchMovies.cancel(); // Cleanup debounce on unmount
  }, [query, fetchMovies]);

  const memoizedMovies = useMemo(() => movies, [movies]);

  return (
    <>
      <Head>
        <title>تطبيق بحث الأفلام</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="relative">
                  <Film className="h-16 w-16 text-purple-400 animate-bounce" />
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  بحث الأفلام
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                اكتشف عالم السينما الساحر واستكشف آلاف الأفلام من جميع أنحاء العالم
              </p>

              <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative flex items-center">
                    <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
                    <input
                      type="text"
                      placeholder="ابحث عن أفلامك المفضلة..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pr-16 pl-8 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-500 hover:bg-white/10"
                      suppressHydrationWarning
                    />
                    {isLoading && (
                      <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                        <div className="relative">
                          <div className="w-6 h-6 border-2 border-purple-400/30 rounded-full"></div>
                          <div className="absolute top-0 left-0 w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" />
                  <span>الأكثر بحثاً اليوم</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto px-4 mb-8 relative z-10">
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
              <div className="relative">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-300 text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-8xl mx-auto px-4 pb-20 relative z-10">
          {memoizedMovies.length > 0 && (
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Star className="h-8 w-8 text-yellow-400" />
                نتائج البحث
              </h2>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full">
                <span className="text-gray-300 text-lg">تم العثور على</span>
                <span className="text-2xl font-bold text-purple-300">{memoizedMovies.length}</span>
                <span className="text-gray-300 text-lg">فيلم</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-8">
            {memoizedMovies.map((movie, index) => (
              <Link href={`/movie/${movie.imdbID}`} key={movie.imdbID}>
                <div
                  className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-3xl overflow-hidden hover:from-white/10 hover:to-white/20 transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/10 hover:border-purple-400/30"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

                  <div className="relative">
                    <div className="aspect-[2/3] relative overflow-hidden rounded-t-3xl">
                      <Image
                        src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg?height=400&width=300&query=movie+poster"}
                        alt={movie.Title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        width={300}
                        height={400}
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                      <div className="absolute top-4 right-4 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500">
                        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>{movie.Year}</span>
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors duration-300">
                          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-white text-sm line-clamp-2 mb-3 group-hover:text-purple-300 transition-colors duration-300 leading-tight">
                        {movie.Title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">
                          {movie.Year}
                        </span>
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-yellow-300 font-medium">IMDb</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {!isLoading && memoizedMovies.length === 0 && query && !error && (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full animate-pulse"></div>
                </div>
                <Film className="relative h-20 w-20 text-gray-500 mx-auto animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">
                لا توجد نتائج
              </h3>
              <p className="text-gray-500 text-lg">جرب البحث بكلمات مختلفة أو تحقق من الإملاء</p>
            </div>
          )}

          {/* Welcome State */}
          {!query && memoizedMovies.length === 0 && (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full animate-pulse"></div>
                  <div className="absolute w-32 h-32 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full animate-pulse delay-1000"></div>
                </div>
                <Film className="relative h-24 w-24 text-purple-400 mx-auto animate-float" />
                <Sparkles className="absolute top-0 right-1/2 transform translate-x-8 h-6 w-6 text-yellow-400 animate-pulse delay-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-200 mb-4">
                ابدأ رحلتك السينمائية
              </h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                اكتب اسم الفيلم في مربع البحث أعلاه واستكشف عالماً من الأفلام الرائعة
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}