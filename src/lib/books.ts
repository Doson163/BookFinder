export interface Book { key: string; title: string; author_name?: string[]; first_publish_year?: number; cover_i?: number; language?: string[]; edition_count?: number }
export interface SearchResult { docs: Book[]; numFound: number }
export interface Work { description?: string | { value: string }; subjects?: string[]; links?: {title: string; url: string}[] }
export async function request<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('Hiện không thể kết nối Open Library. Vui lòng thử lại.');
  return response.json() as Promise<T>;
}
export function searchUrl(query: string, mode: string, page: number) {
  const params = new URLSearchParams({ [mode]: query, page: String(page), limit: '24', fields: 'key,title,author_name,first_publish_year,cover_i,language,edition_count' });
  return `https://openlibrary.org/search.json?${params}`;
}
export function refineBooks(books: Book[], sort: string, withCover: boolean, era: string) {
  return books.filter(b => (!withCover || !!b.cover_i) && (era !== 'modern' || (b.first_publish_year ?? 0) >= 2000)).sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title, 'vi') : sort === 'newest' ? (b.first_publish_year ?? -Infinity) - (a.first_publish_year ?? -Infinity) : sort === 'oldest' ? (a.first_publish_year ?? Infinity) - (b.first_publish_year ?? Infinity) : 0);
}
export function readShelf(): Book[] {
  try { const value: unknown = JSON.parse(localStorage.getItem('bookfinder:shelf:v1') || '[]'); return Array.isArray(value) ? value.filter((b): b is Book => !!b && typeof b.key === 'string' && /^\/works\/OL\d+W$/.test(b.key) && typeof b.title === 'string' && (b.author_name === undefined || (Array.isArray(b.author_name) && b.author_name.every((a: unknown) => typeof a === 'string'))) && (b.cover_i === undefined || typeof b.cover_i === 'number') && (b.first_publish_year === undefined || typeof b.first_publish_year === 'number')) : []; } catch { return []; }
}
