import { describe, it, expect } from 'vitest';
import { refineBooks, searchUrl, type Book } from './books';
const books: Book[] = [{key:'/works/OL1W',title:'Zebra',first_publish_year:2005,cover_i:10},{key:'/works/OL2W',title:'Alpha',first_publish_year:1980},{key:'/works/OL3W',title:'Missing'}];
describe('search and filters',()=>{
 it('encodes author queries safely and paginates',()=>{const url=new URL(searchUrl('Jane Austen & friends','author',2));expect(url.searchParams.get('author')).toBe('Jane Austen & friends');expect(url.searchParams.get('page')).toBe('2');expect(url.searchParams.get('limit')).toBe('24');});
 it('combines cover and publication filters',()=>{expect(refineBooks(books,'relevance',true,'modern').map(b=>b.title)).toEqual(['Zebra']);});
 it('sorts missing years last in either direction without mutating input',()=>{expect(refineBooks(books,'newest',false,'all').map(b=>b.title)).toEqual(['Zebra','Alpha','Missing']);expect(refineBooks(books,'oldest',false,'all').map(b=>b.title)).toEqual(['Alpha','Zebra','Missing']);expect(books[0].title).toBe('Zebra');});
 it('sorts alphabetically and preserves API relevance otherwise',()=>{expect(refineBooks(books,'title',false,'all')[0].title).toBe('Alpha');expect(refineBooks(books,'relevance',false,'all')).toEqual(books);});
});
