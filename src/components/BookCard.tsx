import { useState } from 'react';
import { BookOpen, Heart, ArrowUpRight } from 'lucide-react';
import type { Book } from '../lib/books';
export function Cover({ book, large = false }: { book: Book; large?: boolean }) {
 const [failed, setFailed] = useState(false);
 return <div className={`cover ${large ? 'cover-large' : ''}`}>{book.cover_i && !failed ? <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-${large ? 'L' : 'M'}.jpg?default=false`} alt={`Ảnh bìa sách ${book.title}`} loading="lazy" onError={() => setFailed(true)} /> : <div className="cover-placeholder"><BookOpen size={32}/><span>{book.title}</span><small>Chưa có ảnh bìa</small></div>}</div>;
}
export default function BookCard({ book, saved, toggle, open }: { book: Book; saved: boolean; toggle: (b: Book) => void; open: (b: Book) => void }) {
 return <article className="book-card group"><div className="relative"><button className="cover-button" onClick={() => open(book)} aria-label={`Xem thông tin ${book.title}`}><Cover book={book}/></button><button className={`heart ${saved ? 'saved' : ''}`} onClick={() => toggle(book)} aria-label={`${saved ? 'Bỏ lưu' : 'Lưu'} ${book.title}`} aria-pressed={saved}><Heart size={18} fill={saved ? 'currentColor' : 'none'}/></button></div><p className="book-year">{book.first_publish_year ?? 'Chưa rõ năm'} <span>• SÁCH</span></p><button className="book-title" onClick={() => open(book)}>{book.title}<ArrowUpRight size={16} className="shrink-0"/></button><p className="author">{book.author_name?.join(', ') || 'Chưa rõ tác giả'}</p></article>;
}
