import { useEffect } from 'react'
import './App.css'
import { useBookCollectionStore } from '@/store/bookCollectionStore'
import BookCollectionTable from '@/components/BookCollectionTable'
import BookForm from './components/BookForm'
import { useAppStore } from './store/appStore'
import SettingsDrawer from './components/SettingsDrawer'

function App() {
  const { fetchBooks, fetchCategories, fetchTags } = useBookCollectionStore()
  const { drawerMode } = useAppStore()

  useEffect(() => {
    if (drawerMode === null)
      fetchBooks()
      fetchCategories()
      fetchTags()
  }, [drawerMode])

  return (
    <div>
      <div className="flex justify-end py-4 gap-3">
        <BookForm />
        <SettingsDrawer />
      </div>
      <BookCollectionTable />
    </div>
  )
}

export default App
