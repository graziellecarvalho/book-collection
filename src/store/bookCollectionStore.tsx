import { create } from 'zustand';
import { BookCollectionProps, FetchedBookProps } from '@/types';

export interface BookCollectionState {
  books: BookCollectionProps[] | [];
  selectedBook: BookCollectionProps;
  fetchBooks: () => void;
  setBooks: (booksArr: BookCollectionProps[]) => void;
  setSelectedBook: (bookObj: BookCollectionProps) => void;
}

export const defaultFormValues: BookCollectionProps = {
  id: -1,
  title: "",
  author: "",
  genre: "",
  rating: 0,
  categories: [],
  tags: []
}

export const useBookCollectionStore = create<BookCollectionState>((set, get) => ({
  books: [],
  selectedBook: defaultFormValues,
  fetchBooks: () => {
    const fetchAmount = 4
    const getBookLocally = localStorage.getItem("books");

    if (getBookLocally !== null) {
      // Adding data into state
      set(() => ({ books: JSON.parse(getBookLocally) }))
    } else {
      fetch(`https://fakerapi.it/api/v1/books?_quantity=${fetchAmount}`, { method: 'GET' })
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

        // Adding data into state
        set(() => ({ books: filteredBooks }))
      })
      .catch(error => console.log('Error retrieving Books', error))
    }
    
  },
  setBooks: (booksArr) => {
    localStorage.setItem("books", JSON.stringify(booksArr));
    set(() => ({ books: booksArr }));
  },
  setSelectedBook: (bookObj) => {
    set({ selectedBook: bookObj })
  }
}));