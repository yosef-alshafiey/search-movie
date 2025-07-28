const API_KEY = "1875f5eb";
const BASE_URL = "https://www.omdbapi.com/";

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface MovieDetails extends Movie {
  Genre: string;
  Director: string;
  Plot: string;
  imdbRating: string;
  Response: "True" | "False";
  Error?: string;
}

export interface SearchResponse {
  Response: "True" | "False";
  Search?: Movie[];
  Error?: string;
}

export async function searchMovies(query: string): Promise<SearchResponse> {
  const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error(res.status === 429 ? "تم الوصول إلى الحد الأقصى للطلبات. حاول لاحقًا." : "خطأ في الاتصال بالخادم");
  }
  const data = await res.json();
  return data;
}

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(res.status === 429 ? "تم الوصول إلى الحد الأقصى للطلبات. حاول لاحقًا." : "خطأ في الاتصال بالخادم");
  }
  const data = await res.json();
  return data;
}