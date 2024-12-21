import React from "react";
import { useOutletContext } from "react-router-dom";
import "./MovieVideo.css";

const MovieVideo = () => {
  const { setSelectedVideo, videos, sqlVideo } = useOutletContext();


  return (
    <div className="Main-video-container">
      <div className="Video-Current-Replace">
        <div className="Current-Video-Main-Container">
          <div>
            <h2>Current Video</h2>
          </div>
          <div className="Video-View-Container">
            {sqlVideo && sqlVideo.length > 0 ? (
              sqlVideo.map((video) => (
                <div className="Videos-container" key={video.id}>
                  <p>{video.name}</p>
                  <div className="Video-list">
                    <div className="Video-preview">
                      <iframe
                        width="280"
                        height="158"
                        src={`${video.url}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No videos found</p>
            )}
          </div>
        </div>

        <div className="Video-Replace-Main-Container">
          <div>
            <h2>Replace Video</h2>
          </div>
          <div className="Replace-Video-View-Container">
            {videos && videos.length > 0 ? (
              videos.map((video) => (
                <div className="Replace-videos-container" key={video.id}>
                  <div className="Replace-videos-container-2nd">
                    <p>{video.name}</p>
                    <div className="Replace-video-list">
                      <div className="Replace-video-preview">
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
                        className="Video-Replace-Select-Button"
                        onClick={() => {
                          setSelectedVideo(video);
                          console.log(video);
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
      </div>
    </div>
  );
};

export default MovieVideo;
