import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Userprofile } from './components/Userprofile';
function App() {
  

  return (
    <div className='main'>
      <BrowserRouter basename="/">
          <div className="scroll">
            <Routes>
              <Route path="/" element={<Userprofile/>} />
            </Routes>
          </div>
        </BrowserRouter>
    </div>
  )
}

export default App
