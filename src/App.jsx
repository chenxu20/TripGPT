import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Auth } from './components/auth'
import { db } from './config/firebase';
import { getDocs, collection, addDoc } from 'firebase/firestore';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    //read data from DB
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map( (doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect( () => {

    getMovieList();
  }, [])

  const onSubmitMovie = async () => {
    try {
        await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
      });

      getMovieList();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="App">
      <Auth />
      <div>
        <input 
          placeholder="Movie title..." 
          onChange={ e => setNewMovieTitle(e.target.value)}
        />
        <input 
          placeholder="Release Date..." 
          type="number"
          onChange={ e => setNewReleaseDate(Number(e.target.value))}
        />
        <input 
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={ e => setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>

      <div>
        {movieList.map( (movie) => (
          <div>
            <h1> {movie.title} </h1>
            <p> Date: {movie.releaseDate} </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
