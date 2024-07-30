import { useState } from "react";
// import Navbar from "./components/navbarcomponents";
import tempMovieData from "./tempMoviedata";
import tempWatchedData from "./tempWatchedData";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);




function Main({ children }){
  return  <main className="main">
{children}
</main>
}

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  return (
    <>
<Navbar movies={movies} >

<Results movies={movies}/></Navbar>
   <Main >
     <Box><MovieList movies={movies}/></Box>
          
     
     {/* <WatchedBox /> */}
    <Box><WatchedSummary watched={watched} />
    <WatchedMovieList watched={watched} /></Box>
     
     </Main>  
    </>
  );
}

function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}
function SearchBar(){
  const [query, setQuery] = useState("");

  return(<input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>)
}

function Results({movies}){
  return(<p className="num-results">
  Found <strong>{movies.length}</strong> results
</p>)
}

function Navbar({children}){

  return (<nav className="nav-bar">
    
    <Logo />
    <SearchBar />
{children}
</nav>)
}

function WatchedMovieList({watched ,movies}){
  return ( <ul className="list">
    {watched.map((movie) => (
     <WatchedMovie movie={movie} key={movie.imdbID}/>
    ))}
  </ul>)
}
function WatchedSummary({watched}){
  
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (  <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>  
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
)
}
function WatchedMovie({movie}){
  return ( <li >
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>
    </div>
  </li>)
}
function Box({children}){

  const [isOpen, setIsOpen] = useState(true);
  return(  <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && (
children
    )}
  </div>)
}
/*
function WatchedBox(){


  const [isOpen2, setIsOpen2] = useState(true);

  return (<div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen2((open) => !open)}
    >
      {isOpen2 ? "–" : "+"}
    </button>
    {isOpen2 && (
   
    )}
  </div>)
}
*/
function MovieList({movies}){
 
  return ( <ul className="list">
    {movies?.map((movie) => (
     <Movie movie={movie} key={movie.imdbID}/>
    ))}
  </ul>)
}

function Movie({movie}){
  return ( <li >
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>)
}