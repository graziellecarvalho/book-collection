import { create } from 'zustand';
import { BookCollectionProps, FetchedBookProps, CategoriesTagsProps } from '@/types';

export interface BookCollectionState {
  books: BookCollectionProps[] | [];
  categories: CategoriesTagsProps[];
  tags: CategoriesTagsProps[];
  selectedBook: BookCollectionProps;
  selectedCategory: CategoriesTagsProps;
  selectedTag: CategoriesTagsProps;
  // Books CRUD
  fetchBooks: () => void;
  removeBook: (bookId: string) => void;
  setBooks: (booksArr: BookCollectionProps[]) => void;
  setSelectedBook: (bookObj: BookCollectionProps) => void;
  // Tags CRUD
  fetchCategories: () => void;
  setCategories: (categories: CategoriesTagsProps[]) => void;
  removeCategories: (category: string) => void;
  setSelectedCategory: (category: CategoriesTagsProps) => void
  // Tags CRUD
  fetchTags: () => void;
  setTags: (tag: CategoriesTagsProps[]) => void;
  removeTags: (tag: string) => void;
  setSelectedTag: (tag: CategoriesTagsProps) => void
}

export const defaultFormValues: BookCollectionProps = {
  id: "",
  title: "",
  author: "",
  genre: "",
  rating: 0,
  categories: [{ id: '', label: '' }],
  tags: [{ id: '', label: '' }]
}

export const useBookCollectionStore = create<BookCollectionState>((set, get) => ({
  books: [],
  categories: [],
  tags: [],
  selectedBook: defaultFormValues,
  selectedCategory: { id: '', label: '' },
  selectedTag: { id: '', label: '' },
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
  removeBook: (bookId) => {
    const getBooks = get().books
    const remainingBooks = getBooks.filter(book => book.id !== bookId)
    localStorage.setItem("books", JSON.stringify(remainingBooks));
    set(() => ({ books: remainingBooks }))
  },
  setBooks: (booksArr) => {
    localStorage.setItem("books", JSON.stringify(booksArr));
    set(() => ({ books: booksArr }));
  },
  setSelectedBook: (bookObj) => {
    set({ selectedBook: bookObj })
  },
  fetchCategories: () => {
    const getCategoriesLocally = localStorage.getItem("categories");

    if(getCategoriesLocally !== null) {
      set(() => ({ categories: JSON.parse(getCategoriesLocally)}))
    }
  },
  setCategories: (categories) => {
    localStorage.setItem("categories", JSON.stringify(categories))
    set(() => ({ categories: categories }))
  },
  removeCategories: (categoryId) => {
    const getCategories = get().categories
    const remainingCategories = getCategories.filter(tag => tag.id !== categoryId)
    localStorage.setItem("categories", JSON.stringify(remainingCategories));
    set(() => ({ categories: remainingCategories }))
  },
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  fetchTags: () => {
    const getTagsLocally = localStorage.getItem("tags");

    if(getTagsLocally !== null) {
      set(() => ({ tags: JSON.parse(getTagsLocally)}))
    }
  },
  setTags: (tags) => {
    localStorage.setItem("tags", JSON.stringify(tags))
    set(() => ({ tags: tags }))
  },
  removeTags: (tagId) => {
    const getTags = get().tags
    const remainingTags = getTags.filter(tag => tag.id !== tagId)
    localStorage.setItem("tags", JSON.stringify(remainingTags));
    set(() => ({ tags: remainingTags }))
  },
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));