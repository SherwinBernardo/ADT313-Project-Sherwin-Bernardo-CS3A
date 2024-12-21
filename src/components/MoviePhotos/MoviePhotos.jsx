import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./MoviePhtos.css";

const MoviePhotos = () => {
  const { setSelectedPhotos, photo, sqlPhoto } = useOutletContext();

  console.log("SQL Photo Data:", sqlPhoto);

  return (
    <div className="Main-photo-container">
      <div className="Photos-Current-Replace">
        <div className="Photos-Current-Main-Container">
          <h2>Current Photos</h2>
          <div className="photos-section">
            {sqlPhoto && photo.length > 0 ? (
              sqlPhoto.map((photo) => (
                <div className="current-Photos-container" key={photo.id}>
                  <div className="current-Photo-list">
                    <div className="Photo-preview">
                      <img
                        width="280"
                        height="158"
                        src={`${photo.url}`}
                        alt={`Photo from movie`}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No photos found</p>
            )}
          </div>
        </div>

        <div className="Photos-Replace-Main-Container">
          <h2>Replace Photos</h2>
          <div className="Replace-photos-section">
            {photo && photo.length > 0 ? (
              photo.map((photo) => (
                <div className="Replace-photos-container" key={photo.file_path}>
                  <div className="Photo-list">
                    <div className="Replace-Photo-preview">
                      <img
                        src={`https://image.tmdb.org/t/p/original${photo.file_path}`}
                        alt="Replace Photo"
                        width="280"
                        height="158"
                      />
                    </div>
                    <button
                      className="Replace-Photos-Select-Button"
                      onClick={() => {
                        setSelectedPhotos(photo);
                        alert("Successfully selected a photo!");
                      }}
                    >
                      Select Photo
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No photos found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePhotos;
