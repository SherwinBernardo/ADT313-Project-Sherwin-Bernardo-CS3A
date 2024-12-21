import React from "react";
import { useOutletContext } from "react-router-dom";
import './MovieCast.css';

const MovieCast = () => {
  const { setSelectedCast, cast, sqlCast } = useOutletContext();

  return (
    <div className="Main-cast-container">
      <div className="Cast-Current-Replace">
        <div className="Cast-Current-Main-Container">
          <h2>Current Cast</h2>
          <div className="cast-section">
            {sqlCast && sqlCast.length > 0 ? (
              sqlCast.map((casts) => (
                <div className="Cast-container" key={casts.id}>
                  <p>{cast.name}</p>
                  <p>as {casts.characterName}</p>
                  <div className="Cast-Current-preview">
                    <img
                      width="200"
                      height="300"
                      src={`${cast.url}`}
                      alt={`Photo of ${cast.characterName}`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No cast members found</p>
            )}
          </div>
        </div>

        <div className="Cast-Replace-Main-Container">
          <h2>Replace Cast</h2>
          <div className="cast-section-replace">
            {cast && cast.length > 0 ? (
              cast.map((casts) => (
                <div className="Replace-cast-container" key={casts.cast_id}>
                  <div className="Cast-preview-Replace">
                    <img
                      width="200"
                      height="300"
                      src={
                        casts.profile_path
                          ? `https://image.tmdb.org/t/p/original${casts.profile_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={`Replace ${casts.name}`}
                    />
                  </div>
                  <p>{casts.name}</p>
                  <p>as {casts.character}</p>
                  <button
                    className="Replace-Cast-Select-Button"
                    onClick={() => {
                      setSelectedCast((prev) => [...prev, casts]);
                      alert(`${casts.name} successfully selected!`);
                    }}
                  >
                    Select Cast
                  </button>
                </div>
              ))
            ) : (
              <div className="No-Cast">
                <p>No cast members available for selection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCast;
