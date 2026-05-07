import './App.css'
import { Route, Routes } from 'react-router-dom'
import RecycleAssessment from './pages/RecycleAssessment'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<RecycleAssessment />}></Route>
      </Routes>
    </div>
  )
}

export default App
