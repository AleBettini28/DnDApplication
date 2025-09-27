import './App.css';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import CharacterComponent from './CharacterComponent';
import MainMenu from './MainMenu';
import NoteTaker from './NoteTaker';

function App() {

  return (
    <BrowserRouter basename="/DnDApplication">
      <Routes>
          <Route path='/' element={<MainMenu/>}></Route>
          <Route path='/character-builder' element={<CharacterComponent/>}></Route>
          <Route path='/note-taker' element={<NoteTaker/>}></Route>
      </Routes>
    </BrowserRouter>
  )

// app/layout.tsx
}

export default App