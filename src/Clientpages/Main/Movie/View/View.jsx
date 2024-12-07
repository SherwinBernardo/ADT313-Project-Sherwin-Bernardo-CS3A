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
                  {movie.releaseDate}
                </label>
              </div>
            </div>
          </div>
          {movie.casts && movie.casts.length > 0 ? (
            <div className="cast-crew">
              <h2>Cast & Crew</h2>
              <ul>
                {movie.casts.map((cast) => (
                  <li key={cast.id || cast.name} className="cast-member">
                    <strong>{cast.name}</strong> as {cast.character}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No cast members available for this movie.</p>
          )}

          {movie.videos && movie.videos.length > 0 && (
            <div className="video-preview-container">
              <div className="videos-grid">
                {movie.videos.map((video, index) => (
                  <div key={index} className="video-item">
                    <div className="Movie-combined-display-main">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="Movie-poster-display"
                      />
                      <div className="Trailer-title">
                        <iframe
                          width="700"
                          height="500"
                          src={`https://www.youtube.com/embed/${video.videoKey}`}
                          title={video.name || `Video ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="Movie-video-trailer"
                        ></iframe>

                        <b>
                          {" "}
                          <p className="Trailer-title">
                            {video.name || `Video ${index + 1}`}
                          </p>
                        </b>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
