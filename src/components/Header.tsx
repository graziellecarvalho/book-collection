import bookIcon from '../assets/book-icon.png'
import { LightbulbOff, Lightbulb } from 'lucide-react'

function LightMode () {
  const { isLightModeoOn, setLightModeOn } = useAppStore()

  return (
    <Button
      size="icon"
      style={{ background: !isLightModeoOn ? 'white' : 'black' }}
      onClick={() => setLightModeOn()}
    >
      {!isLightModeoOn ? (
        <Lightbulb color="black" />
      ) : (
        <LightbulbOff />
      )}
    </Button>
  )
}

// App's Header
function Header() {
  const { isLightModeoOn } = useAppStore()

  return (
    <div style={{ ...STYLE.HEADER, ...(isLightModeoOn ? STYLE.HEADER_DARK : STYLE.HEADER_LIGHT)}}>
      <div className="header-wrapper" style={STYLE.HEADER_WRAPPER}>
        <img src={bookIcon} alt="123" width={40} height={40} />
        <div style={{ display: 'flex', gap: 20 }}>
          <LightMode />
          <SettingsDrawer />
        </div>
      </div>
    </div>
  )
}

const STYLE = {
  HEADER: {
    width: '100%',
    height: '60px',
    display: 'flex',
    justifyContent: 'center'
  },
  HEADER_WRAPPER: {
    width: '1280px',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  HEADER_LIGHT: {
    background: '#9e9e9e',
  },
  HEADER_DARK: {
    background: '#464646',
  }
}

export default Header