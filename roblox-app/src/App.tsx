import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {

  return (
    <div className='main'>
      <BrowserRouter basename="/">
          <div className="scroll">
            <Routes>
              <Route path="/" element={<a className='signin' href='/dashboard'> Sign in with roblox</a>} />
              <Route path="/dashboard" element={<div className='dashboard'> signed in succesfully </div>} />
            </Routes>
          </div>
        </BrowserRouter>
    </div>
  )
}

export default App
