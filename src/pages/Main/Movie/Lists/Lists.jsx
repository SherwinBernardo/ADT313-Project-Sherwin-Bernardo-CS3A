import { useNavigate } from "react-router-dom";
import "./Lists.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Lists = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]); 
  const [filteredLists, setFilteredLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const getMovies = () => {
    axios.get("/movies").then((response) => {
      setLists(response.data);
      setFilteredLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);


  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = lists.filter((movie) =>
      movie.title.toLowerCase().includes(value)
    );
    setFilteredLists(filtered);
  };

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      "Are you sure that you want to delete this data?"
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          const updatedLists = lists.filter((movie) => movie.id !== id);
          setLists(updatedLists);
          setFilteredLists(updatedLists);
        });
    }
  };

  return (
    <div className="lists-container">
      <div className="list-create-container">
        <button
          className="list-btn"
          type="button"
          onClick={() => {
            navigate("/main/movies/form");
          }}
        >
          <b>Create new</b>
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="list-table-container">
        <table className="list-movie-lists">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLists.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/main/movies/form/" + movie.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="list-btn"
                    type="button"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
