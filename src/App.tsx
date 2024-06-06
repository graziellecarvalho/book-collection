import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { useCounterStore } from './store/countStore'

function App() {
  const {
    counter,
    increaseCounter,
    decreaseCounter
  } = useCounterStore()

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className='text-2xl'>Vite + React</h1>
      <div className="card">
        <Button onClick={increaseCounter}>
          increase
        </Button>
        <Button onClick={decreaseCounter}>
          decrease
        </Button>
        <p>
          count is {counter}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
