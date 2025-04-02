import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "939fefbc";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isListed, setIsListed] = useState({ listed: false, movieRating: 0 });

  // useEffect(function () {
  //   fetch(`https://www.omdbapi.com/?apikey=939fefbc&s=interstellar`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  function handleSelectedId(id) {
    // const isWatched = watched.some((movie) => movie.imdbID === id);
    const isWatched = watched.find((movie) => movie.imdbID === id);
    const movieRating = isWatched ? isWatched.movieRating : 0;

    const isListedData = {
      listed: isWatched ? true : false,
      movieRating: movieRating,
    };

    setSelectedId((selectedId) => (id === selectedId ? null : id));
    setIsListed(() => isListedData);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleSetWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeletedWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  //Lebih baik pake async...await untuk fetching API
  useEffect(
    function () {
      if (query.length < 3) {
        setMovies([]);
        setIsError("");
        return;
      }

      async function fetchMovie() {
        try {
          setIsLoading(true);
          //always empty error before fetching data
          setIsError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) {
            throw new Error("Something went wrong...");
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not Found");
          }

          setMovies(data.Search);
        } catch (error) {
          console.error(error.message);
          setIsError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovie();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Searchbar query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MoviesList onSelectedId={handleSelectedId} movies={movies} />
          )}
          {isError && <ErrorMessage>{isError}</ErrorMessage>}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onSetWatched={handleSetWatched}
              isListed={isListed}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} onDeleteWatched={handleDeletedWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

//Loader
function Loader() {
  return <p className="loader">Loading...</p>;
}

//Error message
function ErrorMessage({ children }) {
  return <p className="error">{children}</p>;
}

// Navigation Bar
function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Searchbar({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

//Box
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// Main
function Main({ children }) {
  return <main className="main">{children}</main>;
}

//Main - Movie List Section
function MoviesList({ movies, onSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieCard
          movie={movie}
          key={movie.imdbID}
          onSelectedId={onSelectedId}
        />
      ))}
    </ul>
  );
}

function MovieCard({ movie, onSelectedId }) {
  return (
    <li onClick={() => onSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

//Main - Movie Detail
function MovieDetail({ selectedId, onCloseMovie, onSetWatched, isListed }) {
  const [movieDetail, setMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [movieRating, setMovieRating] = useState(0);

  //Deconstraction
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetail;

  function handleSetMovie() {
    const newMovie = {
      imdbID: selectedId,
      poster: poster,
      imdbRating: imdbRating,
      runtime: Number(runtime.split(" ").at(0)),
      movieRating: movieRating,
    };

    onSetWatched(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      if (!selectedId) return; // Prevents unnecessary API calls

      async function fetchMovieDetail() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          const data = await res.json();
          setMovieDetail(data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetail();
    },
    [selectedId]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title || "Unknown"} movie`} />
            <div className="details-overview">
              <h2>{title || "Unknown"}</h2>
              <p>
                {released || "Unknown"} &bull; {runtime || "Unknown"}
              </p>
              <p>{genre || "Unknown"}</p>
              <p>
                <span>⭐</span>
                {imdbRating || "N/A"}
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isListed.listed && <p>You rated this movie:</p>}
              <StarRating
                size={"24px"}
                maxStar={10}
                onSetRating={isListed.movieRating ? null : setMovieRating}
                defaultRating={isListed.movieRating}
                disabledHover={isListed.listed ? true : false}
              />
              {isListed.listed ? null : (
                <button className="btn-add" onClick={handleSetMovie}>
                  + Add to list
                </button>
              )}
            </div>
            <em>{plot}</em>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

//Main - Watched List Box

// function WatchedListBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);
  const avgUserRating = average(
    watched.map((movie) => movie.movieRating)
  ).toFixed(1);
  const avgRuntime = Math.round(average(watched.map((movie) => movie.runtime)));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedCard movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}

function WatchedCard({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.movieRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)} >X</button>
      </div>
    </li>
  );
}
