import React, { useState, useEffect } from "react";
import axios from "axios";
import './MovieGenre.css'

const MovieGenres = ({ movieId }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bearerToken = "your_bearer_token";

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzkwM2QxZmU2MmFlN2QyNjJiNmNjYTQ4M2Y5M2U3MiIsIm5iZiI6MTcyOTc1NzE5NC41NTcsInN1YiI6IjY3MWEwMDBhNWQwZGU4OTA0MmQ4ZGU5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FVVdB2MiqYiPT9zF-DgtzgujwBnAPijbptO9gF3ExSc",
      },
    })
      .then((response) => {
        setGenres(response.data.genres);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data from TMDb API");
        setLoading(false);
      });
  }, [movieId, bearerToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className="Genres">
      <small>Genres:</small>
      {genres.map((genre) => (
        <div key={genre.id} className="genre-div">
          {genre.name}
        </div>
      ))}
    </div>
  );
};

export default MovieGenres;
