import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)



  const fetchMoviesAsync = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://swapi.dev/api/films/')
      if (!response.ok) {
        throw new Error('Something Went Wrong')
      }

      const data = await response.json()
      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }
      })
      setMovies(transformedMovies)
    }

    catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMoviesAsync()
  }, [fetchMoviesAsync]) //since we are passing a function/JS object as a dependency, we must use the hook- useCallback()


  let content = <p>Found No Movies</p>
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }
  if (error) {
    content = <p>{error}</p>
  }
  if (isLoading) {
    content = <p>Loading...</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesAsync}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment >
  );
}

export default App;
