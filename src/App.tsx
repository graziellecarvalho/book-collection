import { useEffect } from 'react'
import './App.css'
import { useBookCollectionStore } from '@/store/bookCollectionStore'
import BookCollectionTable from '@/components/BookCollectionTable'
import BookForm from './components/BookForm'
import { useAppStore } from './store/appStore'
import SettingsDrawer from './components/SettingsDrawer'
import FilterDrawer from './components/FilterDrawer'

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
      <div className="flex justify-between">
        <div className='flex py-4 gap-3'>
          <FilterDrawer />
          <BookForm />
        </div>

        <div className='flex py-4 gap-3'>
          <SettingsDrawer />
          <UserDrawer />
        </div>
      </div>
      <BookCollectionTable />
    </div>
  )
}

export default App
