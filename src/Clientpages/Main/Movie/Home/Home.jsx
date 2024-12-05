import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCards from "../../../../components/MovieCards/MovieCards";
import { useMovieContext } from "../../../../context/MovieContext";

const Home = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 15;
  const maxPageButtons = 10;
  const { movieList, setMovieList, setMovie } = useMovieContext();

  const getMovies = () => {
    axios
      .get("/movies", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setMovieList(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (movieList.length) {
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[random]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movieList]);

  const filteredAndSortedMovies = movieList
    .filter((movie) => movie.title.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === "release_date") {
        return new Date(a.releaseDate) - new Date(b.releaseDate); // Oldest to newest
      }
      if (sortOption === "voteAverage") {
        return b.voteAverage - a.voteAverage; 
      }
      return 0;
    });

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredAndSortedMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredAndSortedMovies.length / moviesPerPage);

  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="main-container">
      {featuredMovie && movieList.length ? (
        <div className="featured-list-container">
          <div
            className="featured-backdrop"
            style={{
              backgroundImage: `linear-gradient(
                to bottom, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.9)),
                url(${
                  featuredMovie.backdropPath !==
                  "https://image.tmdb.org/t/p/original/undefined"
                    ? featuredMovie.backdropPath
                    : featuredMovie.posterPath || "/default/image/path.jpg"
                })`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <span className="featured-movie-title">{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className="featured-list-container-loader"></div>
      )}

      <div className="movies-container">
        <div className="Header-movies">
          <h1 className="movies_h1">Movies</h1>

          <div className="filters-container">
            <input
              type="text"
              placeholder="Search by title..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-dropdown"
            >
              <option className="Options" value="title">
                Sort by Title
              </option>
              <option className="Options" value="release_date">
                Sort by Release Date
              </option>
              <option className="Options" value="voteAverage">
                Sort by Rating
              </option>
            </select>
          </div>
        </div>
        <div className="pagination-container">
          <button
            onClick={handleFirstPage}
            className={currentPage === 1 ? "disabled" : ""}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={handlePrevious}
            className={currentPage === 1 ? "disabled" : ""}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`pagination-number ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNext}
            className={currentPage === totalPages ? "disabled" : ""}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={handleLastPage}
            className={currentPage === totalPages ? "disabled" : ""}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
        <div className="list-container-main">
          <div className="list-container">
            {currentMovies.map((movie) => (
              <div key={movie.id}>
                <MovieCards
                  movie={movie}
                  onClick={() => {
                    navigate(`/view/${movie.id}`);
                    setMovie(movie);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;