import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer"
import { ScrollArea } from "./ui/scroll-area"
import { ReactNode } from "react"
import { useAppStore } from "@/store/appStore"
import { defaultFormValues, useBookCollectionStore } from "@/store/bookCollectionStore"
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
      <DrawerContent className='h-screen left-auto mt-0 w-[500px] rounded-none px-4'>
        <DrawerClose className="w-fit flex items-center" onClick={closeDrawer}>
          <X size={12} />Close
        </DrawerClose>
        <ScrollArea>
          <>
          {children}
          </>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerComponent