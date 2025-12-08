import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RecycleAssessment from './pages/RecycleAssessment'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/recycle' element={<RecycleAssessment/>}></Route>
      </Routes>
    </div>
  )
}

export default App
