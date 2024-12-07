import React from "react";
import { useOutletContext } from "react-router-dom";

const MovieCast = () => {
  const { setSelectedCast, cast, sqlCast } = useOutletContext();

  return (
    <div className="Main-cast-container">
      <div className="Current-Replace">
        <div className="Current-Main-Container">
          <h2>Current Cast</h2>
          <div className="cast-section">
            {sqlCast && sqlCast.length > 0 ? (
              sqlCast.map((member) => (
                <div className="Cast-container" key={member.id}>
                  <p>{member.name}</p>
                  <p>as {member.character}</p>
                  <div className="Cast-photo-preview">
                    <img
                      width="200"
                      height="300"
                      src={
                        member.profilePath ||
                        "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={`Photo of ${member.name}`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No cast members found</p>
            )}
          </div>
        </div>

        <div className="Replace-Main-Container">
          <h2>Replace Cast</h2>
          <div className="cast-section">
            {cast && cast.length > 0 ? (
              cast.map((member) => (
                <div className="Replace-cast-container" key={member.cast_id}>
                  <div className="Cast-photo-preview">
                    <img
                      width="200"
                      height="300"
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/original${member.profile_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={`Replace ${member.name}`}
                    />
                  </div>
                  <p>{member.name}</p>
                  <p>as {member.character}</p>
                  <button
                    className="Select-Button"
                    onClick={() => {
                      setSelectedCast((prev) => [...prev, member]);
                      alert(`${member.name} successfully selected!`);
                    }}
                  >
                    Select Cast
                  </button>
                </div>
              ))
            ) : (
              <p>No cast members available for selection</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCast;
