import { useState, useEffect } from "react";

const KEY = "939fefbc";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

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
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Something went wrong...");
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not Found");
          }

          setMovies(data.Search);
          setIsError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            setIsError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

    //   handleCloseMovie();

      fetchMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return {movies, isLoading, isError};
}
