import React from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

const MoviePhotos = () => {
  const { setSelectedPhotos, photos, sqlPhoto } = useOutletContext();

  return (
    <div className="Main-photo-container">
      <div className="Current-Replace">
        <div className="Current-Main-Container">
          <h2>Current Photos</h2>
          <div className="photos-section">
            {sqlPhoto && sqlPhoto.length > 0 ? (
              sqlPhoto.map((photo) => (
                <div className="Photos-container" key={photo.id}>
                  <p>{photo.name}</p>
                  <div className="Photo-list">
                    <div className="Photo-preview">
                      <img
                        width="280"
                        height="158"
                        src={
                          photo.url ||
                          "https://via.placeholder.com/280x158?text=No+Image"
                        }
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

        <div className="Replace-Main-Container">
          <h2>Replace Photos</h2>
          <div className="photos-section">
            {photos && photos.length > 0 ? (
              photos.map((photo) => (
                <div className="Replace-photos-container" key={photo.file_path}>
                  <div className="Photo-list">
                    <div className="Photo-preview">
                      <img
                        src={`https://image.tmdb.org/t/p/original${photo.file_path}`}
                        alt="Replace Photo"
                        width="280"
                        height="158"
                      />
                    </div>
                    <button
                      className="Select-Button"
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
