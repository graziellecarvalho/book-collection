import { create } from 'zustand';
import { BookCollectionProps, FetchedBookProps } from '@/types';

export interface BookCollectionState {
  books: BookCollectionProps[] | [];
  fetchBooks: () => void;
}

export const useBookCollectionStore = create<BookCollectionState>(set => ({
  books: [],
  fetchBooks: () => {
    fetch('https://fakerapi.it/api/v1/books?_quantity=40', { method: 'GET' })
      .then(response => response.json())
      .then(({ data }: { data: FetchedBookProps[] }) => {
        // Fetching books from API
        const filteredBooks: BookCollectionProps[] = data.map(({ id, title, author, genre }) => ({
          id,
          title,
          author,
          genre,
          rating: 0,
          categories: [],
          tags: []
        }))

        // Fetching books from localstorage
        // WIP

        // Adding data into state
        set(() => ({ books: filteredBooks }))
      })
      .catch(error => console.log('Error retrieving Books', error))
  },
}));