import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Form.css";
import { Outlet } from "react-router-dom";

const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videos, setVideos] = useState([]);
  const [sqlVideo, setSqlVideo] = useState();
  const [selectedVideo, setSelectedVideo] = useState([]);

  let { movieId } = useParams();
  const navigate = useNavigate();

  const url = movieId ? `/movies/${movieId}` : "/movies";
  const method = movieId ? "patch" : "post";

  useEffect(() => {
    if (query !== "") {
      axios({
        method: "get",
        url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzkwM2QxZmU2MmFlN2QyNjJiNmNjYTQ4M2Y5M2U3MiIsIm5iZiI6MTcyOTc1NzE5NC41NTcsInN1YiI6IjY3MWEwMDBhNWQwZGU4OTA0MmQ4ZGU5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FVVdB2MiqYiPT9zF-DgtzgujwBnAPijbptO9gF3ExSc",
        },
      })
        .then((response) => {
          setSearchedMovieList(response.data.results);

          setTotalPages(Math.min(response.data.total_pages, 20));
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    }
  }, [query, page]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    fetchVideos(movie.id);
  };

  const handleAddVideo = async (movieId2) => {
    console.log(movieId2);
    console.log(movieId);

    const accessToken = localStorage.getItem("accessToken");
    const videoData = {
      movieId: movieId ? movieId : movieId2,
      url:
        selectedVideo?.key || selectedVideo.videoKey
          ? `https://www.youtube.com/embed/${
              selectedVideo.key || selectedVideo.videoKey
            }`
          : "https://www.youtube.com/embed/not_available",
      name: selectedVideo?.name || "No video selected",
      site: selectedVideo?.site || "YouTube",
      videoKey:
        selectedVideo?.key || selectedVideo?.videoKey || "not_available",
      videoType:
        selectedVideo?.type || selectedVideo?.videoType || "placeholder",
      official: selectedVideo?.official || false,
    };

    console.log(videoData);

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/videos/${movieId}` : "/videos",
        data: videoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video added successfully:", response.data);
      alert("Video added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
      return false;
    }
  };

  const handleSave = async () => {
    console.log(selectedVideo.key);
    if (!movieId) {
      if (
        videos &&
        videos.length > 0 &&
        (!selectedVideo || !selectedVideo.key)
      ) {
        alert("Videos are available. Please select a video before proceeding.");
        return false;
      }
    }
    if (!videos || videos.length <= 0) {
      alert("No videos found. Proceeding with empty video data.");
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!selectedMovie) {
      alert("Please search and select a movie.");
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: selectedMovie.original_title,
      overview: selectedMovie.overview,
      popularity: selectedMovie.popularity,
      releaseDate: selectedMovie.release_date,
      voteAverage: selectedMovie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: 0,
    };

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const newMovieId = movieId || response.data.id;
      alert("Movie saved successfully!");

      const isVideoAdded = await handleAddVideo(newMovieId);
      if (!isVideoAdded) {
        alert("Video could not be added. Please try again.");
        return;
      }

      navigate(`/main/movies`);
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to save the movie. Please try again.");
    }
  };

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          const tempData = {
            id: response.data.tmdbId,
            original_title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            poster_path: response.data.posterPath,
            release_date: response.data.releaseDate,
            vote_average: response.data.voteAverage,
          };
          setSelectedMovie(tempData);
          console.log(response.data);

          return response.data.tmdbId;
        })
        .then((tmdbId) => {
          axios
            .get(`/videos/${movieId}`)
            .then((videoResponse) => {
              setSqlVideo(videoResponse.data);
              console.log(videoResponse.data);
            })
            .catch((error) => console.log("Error fetching videos:", error));

          console.log(tmdbId);

          fetchVideos(tmdbId);
        })
        .catch((error) => console.log(error));
    }
  }, [movieId]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const fetchVideos = (tmdbId) => {
    return axios
      .get(
        `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzkwM2QxZmU2MmFlN2QyNjJiNmNjYTQ4M2Y5M2U3MiIsIm5iZiI6MTcyOTc1NzE5NC41NTcsInN1YiI6IjY3MWEwMDBhNWQwZGU4OTA0MmQ4ZGU5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FVVdB2MiqYiPT9zF-DgtzgujwBnAPijbptO9gF3ExSc",
          },
        }
      )
      .then((response) => {
        const videoResults = response.data.results;
        setVideos(videoResults.length > 0 ? videoResults : "");
        console.log("Videos from TMDB:", videoResults);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setVideos("");
      });
  };

  return (
    <>
      <div className="div-title-page">
        <h1 className="title-page">
          {movieId !== undefined ? "Edit " : "Create "} Movies
        </h1>
      </div>
      {movieId === undefined && (
        <>
          <div className="form-search-container">
            <div className="form-search-container-btn">
              <input
                className="input-search"
                placeholder="Search movie"
                type="text"
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
              <button type="button" onClick={() => setPage(1)}>
                <b>Search</b>
              </button>
            </div>
            {searchedMovieList.length > 0 && (
              <>
                <div className="form-searched-movie">
                  {searchedMovieList.map((movie) => (
                    <p key={movie.id} onClick={() => handleMovieSelect(movie)}>
                      {movie.original_title}
                    </p>
                  ))}
                </div>
                <div className="form-pagination">
                  <button disabled={page === 1} onClick={handlePreviousPage}>
                    <b>Previous</b>
                  </button>
                  <span>
                    <b>
                      Page {page} of {totalPages}
                    </b>
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={handleNextPage}
                  >
                    <b>Next</b>
                  </button>
                </div>
              </>
            )}
          </div>
          <hr />
        </>
      )}

      <div className="form-container">
        <form>
          {selectedMovie ? (
            <img
              className="form-poster-image"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            />
          ) : (
            ""
          )}
          <div className="form-field">
            <b>Title:</b>
            <input
              type="text"
              value={selectedMovie ? selectedMovie.original_title : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  original_title: e.target.value,
                })
              }
            />
          </div>
          <div className="form-field">
            <b>Overview:</b>
            <textarea
              rows={10}
              value={selectedMovie ? selectedMovie.overview : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  overview: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <b>Popularity:</b>
            <input
              type="text"
              value={selectedMovie ? selectedMovie.popularity : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  popularity: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <b>Release Date:</b>
            <input
              type="text"
              value={selectedMovie ? selectedMovie.release_date : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  release_date: e.target.value,
                })
              }
            />
          </div>

          <div className="form-field">
            <b>Vote Average:</b>
            <input
              type="text"
              value={selectedMovie ? selectedMovie.vote_average : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  vote_average: e.target.value,
                })
              }
            />
          </div>

          <button className="form-button" type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      </div>

      {!movieId && (
        <>
          <div className="videosMainCont">
            {videos && videos.length > 0 ? (
              videos.map((video) => (
                <div className="videosCont" key={video.id}>
                  <p>{video.name}</p>
                  <div className="videolist">
                    <div className="video-preview">
                      <iframe
                        width="280"
                        height="158"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedVideo(video);
                        alert("Successfully selected a video!");
                      }}
                    >
                      Select Video
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No videos found</p>
            )}
          </div>
        </>
      )}

      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <nav>
            <ul className="tabs">
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
                Photos
              </li>
            </ul>
          </nav>

          <Outlet context={{ setSelectedVideo, videos, sqlVideo }} />
        </div>
      )}
    </>
  );
};

export default Form;
