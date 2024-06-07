export interface BookProps {
  id: string;
  title: string;
  author: string;
  genre: string;
}

export interface FetchedBookProps extends BookProps {
  description: string;
  isbn: string;
  image: string;
  published: string;
  publisher: string;
}

export interface BookCollectionProps extends BookProps {
  rating?: number;
  categories?: CategoriesTagsProps[];
  tags?: CategoriesTagsProps[];
}

export interface CategoriesTagsProps {
  id: string;
  label: string;
}