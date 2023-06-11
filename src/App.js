import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-6e5b3-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Unable to Fetch Movies");
      }

      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        const currData = data[key];
        loadedMovies.push({
          id: key,
          title: currData.title,
          releaseDate: currData.releaseDate,
          openingText: currData.openingText,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(`${error.message}`);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://react-http-6e5b3-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("🚀 ~ file: App.js:53 ~ addMovieHandler ~ data:", data);
  };

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
