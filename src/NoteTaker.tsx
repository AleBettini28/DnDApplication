import {
  type BaseSyntheticEvent,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

function NoteTaker() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved || '';
  });

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  function handleChange(e: BaseSyntheticEvent) {
    setNotes(e.target.value);
  }

  return (
    <>
      <div className='top-button-bar'>
        <button className='dnd-button' onClick={() => navigate("/")}>D&D Wiki</button>
        <button className='dnd-button' onClick={() => navigate("/character-builder")}>Character Builder</button>
        <button className='dnd-button' onClick={() => navigate("/note-taker")}>Notes</button>
      </div>

      <h1>Take notes of your session!</h1>
      <div className='notes-container'>
        <div className='left-notes-div'>
          <div>{notes}</div>
        </div>
        <div className='right-notes-div'>
          <textarea
            rows={20}
            className='dnd-input-textarea'
            placeholder='notes...'
            autoFocus
            value={notes}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}

export default NoteTaker;
