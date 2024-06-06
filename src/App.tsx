import { useEffect } from 'react'
import './App.css'
import { useBookCollectionStore } from './store/bookCollectionStore'
import BookCollectionTable from './components/BookCollectionTable'

function App() {
  const { fetchBooks } = useBookCollectionStore()

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div>
      <BookCollectionTable />
    </div>
  )
}

export default App
