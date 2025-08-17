import './App.css'
import Login from './pages/login'
import Genre from './pages/genre'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Widgets from './pages/widgets'
import Movies from './pages/movies'
import MovieDetail from './pages/movieDetail'
function App() {


  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/genre" element={<Genre />} />
          <Route path='/widgets' element={<Widgets />} />
          <Route path='/movies' element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetail />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App