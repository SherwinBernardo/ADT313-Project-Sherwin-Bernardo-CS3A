import "./MovieCards.css";
function MovieCards({ movie: movie, onClick }) {
  return (
    <>
      <div className="card" onClick={onClick}>
        <img src={movie.posterPath} />
        <span className="title">{movie.title}</span>
      </div>
    </>
  );
}

export default MovieCards;
