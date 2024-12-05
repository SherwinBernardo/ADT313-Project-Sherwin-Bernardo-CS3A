import React, { useEffect, useState } from "react"; // Add useState to the import
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./View.css";
import MovieGenre from "../../../../components/MoviesGenres/MovieGenres";



function View({ setSelectedMovie }) {
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;

          const transformedMovie = {
            ...movieData,
            videos: movieData.videos || [],
            photos: movieData.photos || [],
            casts: movieData.casts || [],
          };

          setMovie(transformedMovie);
          setSelectedMovie?.(transformedMovie);
        })
        .catch((error) => {
          console.error("Error fetching movie data:", error);
          navigate("/");
        });
    }
  }, [movieId, navigate, setSelectedMovie]);

  return (
    <div className="Movie-details">
      {movie ? (
        <>
          <div className="banner">
            <div>
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="Movie-poster"
              />
            </div>

            <div className="Movie-info">
              <div className="Movie-info-2nd">
                <h1 className="Movie-title">{movie.title}</h1>
                <p className="Overview">{movie.overview}</p>
                <MovieGenre movieId={movie.tmdbId} />
                <label className="Popularity">
                  <small>Popularity:</small>
                  {movie.popularity}
                </label>
                <label className="Vote-Average">
                  <small>Rating:</small>
                  {movie.voteAverage} / 10
                </label>
                <label className="Release-date">
                  <small>Released date:</small>
                  {movie.releaseDate}</label>
              </div>
            </div>
          </div>
          {movie.casts && movie.casts.length > 0 && (
            <div className="cast-crew">
              <h2>Cast & Crew</h2>
              <ul>
                {movie.casts.map((cast, index) => (
                  <li key={index} className="cast-member">
                    <strong>{cast.name}</strong> as {cast.character}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movie.videos && movie.videos.length > 0 && (
            <div className="video-preview">
              <h2>Trailer</h2>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${movie.videos[0]?.videoKey}`}
                title={movie.videos[0]?.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {movie.photos && movie.photos.length > 0 && (
            <div className="movie-photos">
              <h2>Photos</h2>
              <div className="photo-gallery">
                {movie.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    alt={`Movie Photo ${index + 1}`}
                    className="photo-item"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
}

export default View;
