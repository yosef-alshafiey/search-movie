"use client"; // Added to support client-side rendering (if needed)
import Link from "next/link";
import Image from "next/image"; // Added for optimized images
import { ArrowLeft, Calendar, User, Clock, Globe, Play, Heart, Share, Bookmark, Award, Film } from 'lucide-react';
import { getMovieDetails } from "@/utils/api";

interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre: string;
  Director: string;
  Plot: string;
  imdbRating: string;
  Runtime?: string;
  Country?: string;
  Language?: string;
  Actors?: string;
  Response: "True" | "False";
  Error?: string;
}

interface MovieDetailsPageProps {
  params: { id: string };
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { id } = params;
  let movie: MovieDetails | null = null;
  let error: string | null = null;

  try {
    const data = await getMovieDetails(id);
    if (data.Response === "True") {
      movie = data;
    } else {
      error = data.Error || "لم يتم العثور على الفيلم";
    }
  } catch (err: unknown) {
    error =
      err instanceof Error
        ? err.message.includes("429")
          ? "تم الوصول إلى الحد الأقصى للطلبات. حاول لاحقًا."
          : "حدث خطأ أثناء الاتصال"
        : "خطأ غير معروف";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-lg mx-4 shadow-2xl">
          <div className="text-8xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            حدث خطأ
          </h2>
          <p className="text-red-300 mb-8 text-lg leading-relaxed">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            العودة إلى البحث
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-400/30 rounded-full mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-xl font-medium">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.svg?height=1080&width=1920&query=movie+backdrop"}
          alt={`${movie.Title} backdrop`}
          className="w-full h-full object-cover opacity-5"
          width={1920}
          height={1080}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-purple-950/90 to-slate-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10">
        <div className="p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-purple-300 hover:text-white transition-all duration-300 group bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 hover:border-purple-400/30"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">العودة إلى البحث</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-20">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-10"></div>

            <div className="relative">
              <div className="flex flex-col xl:flex-row">
                <div className="xl:w-2/5 p-8">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <Image
                        src={
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "/placeholder.svg?height=600&width=400&query=movie+poster"
                        }
                        alt={movie.Title}
                        className="w-full rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-105"
                        width={400}
                        height={600}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors duration-300 cursor-pointer">
                          <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2">
                      <Play className="h-5 w-5" />
                      مشاهدة الآن
                    </button>
                    <button className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                      <Share className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="xl:w-3/5 p-8">
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                        {movie.Title}
                      </h1>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 rounded-2xl border border-yellow-500/30">
                          <Award className="h-6 w-6 text-yellow-400" />
                          <span className="text-yellow-300 font-bold text-xl">{movie.imdbRating}</span>
                          <span className="text-gray-400 text-sm font-medium">IMDb</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 bg-white/10 px-4 py-2 rounded-xl">
                          <Calendar className="h-5 w-5" />
                          <span className="font-medium">{movie.Year}</span>
                        </div>
                        {movie.Runtime && (
                          <div className="flex items-center gap-3 text-gray-300 bg-white/10 px-4 py-2 rounded-xl">
                            <Clock className="h-5 w-5" />
                            <span className="font-medium">{movie.Runtime}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                        <Film className="h-5 w-5" />
                        النوع
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {movie.Genre.split(", ").map((genre, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-xl text-sm border border-purple-500/30 font-medium hover:from-purple-600/30 hover:to-pink-600/30 transition-colors duration-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-purple-300 mb-4">القصة</h3>
                      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <p className="text-gray-200 leading-relaxed text-lg">{movie.Plot}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          المخرج
                        </h3>
                        <p className="text-gray-200 font-medium">{movie.Director}</p>
                      </div>

                      {movie.Actors && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-bold text-purple-300 mb-3">الممثلون</h3>
                          <p className="text-gray-200 font-medium">{movie.Actors}</p>
                        </div>
                      )}

                      {movie.Country && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            البلد
                          </h3>
                          <p className="text-gray-200 font-medium">{movie.Country}</p>
                        </div>
                      )}

                      {movie.Language && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                          <h3 className="text-lg font-bold text-purple-300 mb-3">اللغة</h3>
                          <p className="text-gray-200 font-medium">{movie.Language}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}