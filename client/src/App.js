import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Chat></Chat>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
