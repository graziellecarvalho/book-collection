import { useEffect } from 'react'
import './App.css'
import { useBookCollectionStore } from '@/store/bookCollectionStore'
import BookCollectionTable from '@/components/BookCollectionTable'
import BookForm from './components/BookForm'
import { useAppStore } from './store/appStore'
import FilterDrawer from './components/FilterDrawer'

function App() {
  const { fetchBooks, fetchCategories, fetchTags } = useBookCollectionStore()
  const { drawerMode } = useAppStore()
  const { isLightModeoOn } = useAppStore()

  useEffect(() => {
    if (drawerMode === null)
      fetchBooks()
      fetchCategories()
      fetchTags()
  }, [drawerMode])

  return (
    <div className={`wrapper ${isLightModeoOn ? 'dark-mode' : 'light-mode'}`}>
      <Header />
      <div id="app-wrapper">
        <div className="app-wrapper flex justify-end py-4 gap-3">
          <BookForm />
          <FilterDrawer />
        </div>
        <BookCollectionTable />
      </div>
    </div>
  )
}

export default App
