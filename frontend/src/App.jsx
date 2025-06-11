// frontend/src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [pingResult, setPingResult] = useState(null)

  const handlePing = async () => {
    try {
      const response = await fetch('http://localhost:8000/ping')
      const data = await response.json()
      setPingResult(data.message)
    } catch (error) {
      setPingResult("Error connecting to backend")
    }
  }

  return (
    <div>
      <h1>Frontend ↔ Backend Test</h1>
      <button onClick={handlePing}>Ping Backend</button>
      {pingResult && <p>Response: {pingResult}</p>}
    </div>
  )
}

export default App
