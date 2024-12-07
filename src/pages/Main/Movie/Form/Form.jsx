import axios from "axios";
import { useEffect, useState, useCallback } from "react";
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

  const [photos, setPhotos] = useState([]);
  const [sqlPhoto, setSqlPhoto] = useState();
  const [selectedPhoto, setSelectedPhoto] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [cast, setCast] = useState([]);
  const [sqlCast, setSqlCast] = useState();
  const [selectedCast, setSelectedCast] = useState([]);

  let { movieId } = useParams();
  const navigate = useNavigate();



  const togglePhotoSelection = (photo) => {
    setSelectedPhotos((prevSelected) => {
      if (prevSelected.find((p) => p.file_path === photo.file_path)) {
        return prevSelected.filter((p) => p.file_path !== photo.file_path); 
      } else {
        return [...prevSelected, photo]; 
      }
    });
  };

  const handleAddPhotos = async (movieId2) => {
    const accessToken = localStorage.getItem("accessToken");

    if (selectedPhotos.length === 0) {
      alert(
        "No photos selected. Please select at least one photo before saving."
      );
      return false;
    }

    try {
      for (const photo of selectedPhotos) {
        const photoData = {
          movieId: movieId || movieId2,
          url: `https://image.tmdb.org/t/p/original${photo.file_path}`,
          name: "Photo", 
          photoType: "backdrop", 
          description: "Default description", 
        };

        console.log("Photo Data:", photoData);

        await axios({
          method: movieId ? "patch" : "post",
          url: movieId ? `/photos/${movieId}` : "/photos",
          data: photoData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      console.log("Photos added successfully!");
      alert("Photos added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding photos:", error.response || error.message);
      alert(
        `Failed to add photos. ${
          error.response?.data?.message || "Please try again later."
        }`
      );
      return false;
    }
  };

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
  //////////////for casttttttttttttttttttttt

   const toggleCastSelection = (actor) => {
  setSelectedCast((prevSelectedCast) => {
    // Check if the actor is already selected
    if (prevSelectedCast.find((a) => a.cast_id === actor.cast_id)) {
      // Remove the actor from the selection
      return prevSelectedCast.filter((a) => a.cast_id !== actor.cast_id);
    } else {
      // Add the actor to the selection
      return [...prevSelectedCast, actor];
    }
  });
};

 const handleAddCast = () => {
  // Implement the function that saves the selected cast, e.g., making an API call or updating the state
  alert('Selected cast has been saved!');
};
  const fetchCast = useCallback((movieId) => {
    if (!movieId) return;

    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGI5YzY1YzM2ZDk5MTVjYjY3MDgyZDRhN2JjNWUyZiIsIm5iZiI6MTczMzQ5MDkyMC44OTQsInN1YiI6IjY3NTJmOGU4NzJkMWE4YTU5YzI5YWZhNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8-rhvtpo3t6g396lRYpIw0V0Wx5B9CBb65Mg_6TeHM4", // Replace with your token
      },
    })
      .then((response) => {
        setCast(response.data.cast || []); 
      })
      .catch((error) => {
        console.error("Error fetching cast:", error);
      });
  }, []);

  useEffect(() => {
    if (movieId || selectedMovie?.id) {
      fetchCast(movieId || selectedMovie.id);
    }
  }, [movieId, selectedMovie, fetchCast]);

  //////for photossssssssssssssssss

  const fetchPhotos = (tmdbId) => {
    if (!tmdbId) {
      console.error("No TMDB ID provided to fetch photos.");
      return;
    }

    axios
      .get(`https://api.themoviedb.org/3/movie/${tmdbId}/images`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYzkwM2QxZmU2MmFlN2QyNjJiNmNjYTQ4M2Y5M2U3MiIsIm5iZiI6MTcyOTc1NzE5NC41NTcsInN1YiI6IjY3MWEwMDBhNWQwZGU4OTA0MmQ4ZGU5ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FVVdB2MiqYiPT9zF-DgtzgujwBnAPijbptO9gF3ExSc",
        },
      })
      .then((response) => {
        if (response.data && response.data.backdrops) {
          setPhotos(
            response.data.backdrops.length > 0 ? response.data.backdrops : []
          );
          console.log("Fetched Photos:", response.data.backdrops);
        } else {
          setPhotos([]);
          console.warn("No photos available for the given TMDB ID.");
        }
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
        setPhotos([]);
      });
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
  const handleAddPhoto = async (movieId2) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!selectedPhoto || !selectedPhoto.file_path) {
      alert("No photo selected. Please select a photo before saving.");
      return false;
    }

    const photoData = {
      movieId: movieId ? movieId : movieId2,
      url: `https://image.tmdb.org/t/p/original${selectedPhoto.file_path}`,
      name: "Photo",
      photoType: "backdrop",
      description: "Default description", 
    };

    console.log("Photo Data:", photoData);

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/photos/${movieId}` : "/photos",
        data: photoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Photo added successfully:", response.data);
      alert("Photo added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding photo:", error.response || error.message);
      alert(
        `Failed to add photo. ${
          error.response?.data?.message || "Please try again later."
        }`
      );
      return false;
    }
  };

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/photos/${movieId}`)
        .then((photoResponse) => {
          setSqlPhoto(photoResponse.data);
          console.log(photoResponse.data);
        })
        .catch((error) => console.log("Error fetching photos:", error));
    }
  }, [movieId]);

   useEffect(() => {
     if (movieId) {
       axios
         .get(`/casts/${movieId}`)
         .then((castResponse) => {
           setSqlCast(castResponse.data);
           console.log(castResponse.data);
         })
         .catch((error) => console.log("Error fetching photos:", error));
     }
   }, [movieId]);

  useEffect(() => {
    if (selectedMovie && selectedMovie.id) {
      fetchPhotos(selectedMovie.id);
    }
  }, [selectedMovie]);

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
    if (!selectedMovie) {
      alert("Please search and select a movie.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
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
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const newMovieId = movieId || response.data.id;
      alert("Movie saved successfully!");

      const arePhotosAdded = await handleAddPhotos(newMovieId);
      if (!arePhotosAdded) {
        alert("Photos could not be added. Please try again.");
        return;
      }

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

  useEffect(() => {
    if (movieId) {
      fetchVideos();
      fetchPhotos();
    }
  }, [movieId]);

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
          <div className="videos-Main-Container">
            <h2 className="h2-Videos">Videos</h2>
            <div className="Second-Video-container">
              {videos && videos.length > 0 ? (
                videos.map((video) => (
                  <div className="Videos-Container" key={video.id}>
                    <div className="Video-Title">
                      <p>{video.name}</p>
                      <div className="video-list">
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
                          className="Select-Button"
                          onClick={() => {
                            setSelectedVideo(video);
                            alert("Successfully selected a video!");
                          }}
                        >
                          Select Video
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No videos found</p>
              )}
            </div>
          </div>
          <div className="Second-Photo-container">
            <h1 style={{ color: "white" }}>Photos</h1>
            {photos && photos.length > 0 ? (
              photos.map((photo) => (
                <div className="Photos-Container" key={photo.file_path}>
                  <div className="Photo-Title">
                    <div className="photo-list">
                      <div className="photo-preview">
                        <img
                          width="280"
                          height="158"
                          src={
                            photo.file_path
                              ? `https://image.tmdb.org/t/p/original${photo.file_path}`
                              : "https://via.placeholder.com/280x158?text=No+Image"
                          }
                          alt="Photo from movie"
                        />
                      </div>
                      <button
                        className={`Select-Button ${
                          selectedPhotos.find(
                            (p) => p.file_path === photo.file_path
                          )
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => togglePhotoSelection(photo)}
                      >
                        {selectedPhotos.find(
                          (p) => p.file_path === photo.file_path
                        )
                          ? "Unselect Photo"
                          : "Select Photo"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No photos found</p>
            )}
          </div>

          <div className="cast-list">
            <h2>Cast</h2>
            {cast.length > 0 ? (
              cast.slice(0, 10).map((actor) => (
                <div key={actor.cast_id} className="cast-member">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={actor.name}
                    className="cast-photo"
                  />
                  <div className="cast-info">
                    <p>
                      <strong>{actor.name}</strong>
                    </p>
                    <p>as {actor.character}</p>
                  </div>
                  <button
                    className={`cast-select-button ${
                      selectedCast.find((a) => a.cast_id === actor.cast_id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => toggleCastSelection(actor)}
                  >
                    {selectedCast.find((a) => a.cast_id === actor.cast_id)
                      ? "Unselect Cast"
                      : "Select Cast"}
                  </button>
                </div>
              ))
            ) : (
              <p>No cast information available for this movie.</p>
            )}
          </div>

          {selectedCast.length > 0 && (
            <div>
              <h3>Selected Cast</h3>
              {selectedCast.map((actor) => (
                <p key={actor.cast_id}>
                  {actor.name} as {actor.character}
                </p>
              ))}
              <button
                onClick={() => handleAddCast(selectedMovie?.id || movieId)}
              >
                Save Selected Cast
              </button>
            </div>
          )}
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

          <Outlet
            context={{
              setSelectedVideo,
              videos,
              sqlVideo,
              setSelectedPhotos,
              photos,
              sqlPhoto,
              setSelectedCast,
              cast,
              sqlCast,
            }}
          />
        </div>
      )}
    </>
  );
};

export default Form;
