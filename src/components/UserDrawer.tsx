import { User} from "lucide-react";

function UserDrawer() {
  const { setDrawerMode } = useAppStore();

  return (
    <DrawerComponent
      item="user"
      triggerButton={
        <Button onClick={() => setDrawerMode("user")} variant="secondary" className="flex gap-2">
          <User size={18} />
          User
        </Button>
      }
    >
      <DrawerHeader className="px-0">
        <DrawerTitle>User</DrawerTitle>
      </DrawerHeader>

      <div className="flex flex-col gap-6">
        
      </div>
    </DrawerComponent>
  );
}

export default UserDrawer;