import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin } from './components/Signin';
function App() {
  

  return (
    <div className='main'>
      <BrowserRouter basename="/">
          <div className="scroll">
            <Routes>
              <Route path="/" element={<Signin/>} />
              <Route path="/dashboard" element={<div className='dashboard'> signed in succesfully </div>} />
            </Routes>
          </div>
        </BrowserRouter>
    </div>
  )
}

export default App
