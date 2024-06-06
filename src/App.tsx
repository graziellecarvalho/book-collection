import { useEffect } from 'react'
import './App.css'
import { useBookCollectionStore } from '@/store/bookCollectionStore'
import BookCollectionTable from '@/components/BookCollectionTable'
import AddBookDrawer from './components/AddBookDrawer'

function App() {
  const { fetchBooks } = useBookCollectionStore()

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div>
      <div className="flex justify-end py-4 gap-3">
        <AddBookDrawer />
      </div>
      <BookCollectionTable />
    </div>
  )
}

export default App
