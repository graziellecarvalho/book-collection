import { ReactNode } from "react"
import { X } from 'lucide-react';

function DrawerComponent({ children, triggerButton, item }: { children: ReactNode, triggerButton: ReactNode, item: 'settings' | 'form' | 'filter' | null }) {
  const { drawerMode, setDrawerMode } = useAppStore()
  const { setSelectedBook } = useBookCollectionStore()

  const closeDrawer = () => {
    if (drawerMode === 'form') 
      setSelectedBook({ ...defaultFormValues, id: '' })
      
    setDrawerMode(null)
  }

  return (
    <Drawer direction='right' open={drawerMode === item} onClose={closeDrawer}>
      {/* OPEN DRAWER */}
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>

      {/* DRAWER CONTENT */}
      <DrawerContent style={STYLE.FORM} className='h-screen left-auto mt-0 md:w-[500px] w-96 rounded-none px-4'>
        <DrawerClose className="w-fit flex items-center" onClick={closeDrawer}>
          <X size={12} />Close
        </DrawerClose>
        <ScrollArea>
          {children}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

const STYLE = {
  FORM: {
    background: '#2e2e2e',
    border: '1px solid #9c9c9c',
    color: 'white'
  }
}

export default DrawerComponent