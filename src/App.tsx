import { useEffect } from 'react'
import './App.css'
import { useBookCollectionStore } from '@/store/bookCollectionStore'
import BookCollectionTable from '@/components/BookCollectionTable'
import AddBookDrawer from './components/AddBookDrawer'
import { useAppStore } from './store/appStore'

function App() {
  const { fetchBooks } = useBookCollectionStore()
  const { displayForm } = useAppStore()

  useEffect(() => {
    if (!displayForm)
      fetchBooks()
  }, [displayForm])

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
