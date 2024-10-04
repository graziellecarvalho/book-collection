function BookInfo () {
  const { selectedBook } = useBookCollectionStore()

  return (
    <div>
      {selectedBook.id !== '' && (
        <h1 className="text-5xl font-semibold">{selectedBook.title}, by {selectedBook.author}</h1> 
      )}
    </div>
  )
}

export default BookInfo