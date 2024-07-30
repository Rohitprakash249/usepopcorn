import { useState, useEffect} from "react";
import StarRating from "./StarRating"
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

const KEY = 'd3c3228d';
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);

  const [isLoading , setIsLoading] = useState(false);
  const [fetchingError , setFetchingError] = useState('');
  const [selectedId , setSelectedId]= useState();
  //  const tempQuery ="bond";
function handleAddWatched(movie){
  setWatched((watched)=>[...watched ,movie]);
}
function handleDeleteMovie(id){
setWatched((watched)=> watched.filter((x)=> x.imdbID !== id))
}
function handleSelectMovie(id){
  setSelectedId((selectedId)=> (selectedId===id ? null : id));
}

function handleCloseMovie(){
  setSelectedId(null);

}

useEffect(function () {

const controller = new AbortController();

async function fetchMovies(){
try {
  setIsLoading(true);
  setFetchingError("");
 const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{ signal: controller.signal }
);

if(!res.ok)
  throw new Error("there's some problme with fetching data");

const data = await res.json();
if(data.Response === "False") throw new Error("No Movie Found");
  //agar length nhi hai mtlb zero hai.

setMovies(data.Search);
setFetchingError("");
} catch(err){

  if(err.name!== "AbortError"){
    setFetchingError(err.message);
  }

} finally {
  setIsLoading(false);
}

if(!query.length) {
  setMovies([]);
  setFetchingError("");
  return;
}

}
handleCloseMovie();
 fetchMovies();

 return function(){
  controller.abort();
 };

}, [query]);

  return (
    <>
<Navbar movies={movies} >
<SearchBar query={query} setQuery={setQuery}/>
<Results movies={movies}/>



</Navbar>
   <Main >
     <Box>
      {isLoading && <Loader />}
      {!isLoading && !fetchingError && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
      {fetchingError && <ErrorMessage fetchingError={fetchingError} />}
      
      
     {/* {isLoading? <Loader />:<MovieList movies={movies}/>} */}
      </Box>
          
     
     {/* <WatchedBox /> */}

  
   <Box>
    
   {selectedId? <MovieDetails  watched={watched} selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} /> : <>   <WatchedSummary watched={watched} />
   <WatchedMovieList watched={watched} onDeleteWatchedMovie={handleDeleteMovie} /></>}

 </Box>
     
     </Main>  
    </>
  );
}

function MovieDetails({selectedId , onCloseMovie ,onAddWatched ,watched}){

const [movie, setMovie]= useState({});
const [loading,setLoading]= useState();
const [userRating,setUserRating]=useState("");
const [alreadyAdded,setAlreadyAdded] =  useState('');
const [checked ,setChecked]=useState();

const isWatched = watched.map((x) => x.imdbID).includes(selectedId);

const watchedUserRating= watched.find((movie)=> movie.imdbID===selectedId)?.userRating;


const {Title :title,Year:year,Poster:poster,Runtime:runtime,imdbRating,
  Plot:plot,
  Released:released,
  Actors:actors,
  Director:director,
  Genre:genre,

} = movie;
// console.log(movie.Title);

function handleAdd(){

   const newWatchedMovie={
    imdbID: selectedId,
    title,
    year,
    poster,
    imdbRating: Number(imdbRating),
    runtime: Number(runtime.split(" ").at(0)),
    userRating,
   }
  
  onAddWatched(newWatchedMovie);
  onCloseMovie();

}
useEffect(function (){
  function callBack(e){
    if(e.code==="Escape"){
      onCloseMovie();
      console.log("closing");
    }
  }
  document.addEventListener('keydown',callBack)
return function(){
  document.removeEventListener('keydown',callBack
  );
}

},[onCloseMovie]);

useEffect(function(){
  async function getMovieDetails(){
    setLoading(true);
    const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
    const data = await res.json();
    setMovie(data);

    setLoading(false);

  }
  getMovieDetails();
},[selectedId])

useEffect(function (){
if(!title) return;
document.title=`Movie ${title}`

return function(){
  document.title="usePopcorn";
}


},[title])


  return <div className="details">


    {loading? <Loader /> : <>   <header>



    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
    <img src={poster} alt={`Poster of ${title} movie`}/>
    <div className="details-overview"><h2>{title}</h2>
<p>{released} &bull;</p>
<p>{genre}</p>
<p><span>⭐</span>{imdbRating}IMDB rating</p>
</div>

    </header>
 <section>
  <div className="rating"> 

{!isWatched ? <>
<StarRating maxRating={10} size={25}
   onSetRating={setUserRating}
   />
{userRating &&   <button className="btn-add" 
onClick={handleAdd}>+ Add to list</button>}
</>
  : <p>You've already Rated this movie {watchedUserRating} <span>⭐</span></p>}



  {/* <button className="btn-add" onClick={handleAdd}>add +</button> */}
  {/* {userRating &&   <button className="btn-add" onClick={handleAdd}>add +</button>} */}

  </div>

  <p><em>{plot}</em></p>
  <p>Starring {actors}</p>
  <p>Directed by {director}</p>
 </section></> }
    {/* <header>
    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
    <img src={poster} alt={`Poster of ${title} movie`}/>
    <div className="details-overview"><h2>{title}</h2>
<p>{released} &bull;</p>
<p>{genre}</p>
<p><span>⭐</span>{imdbRating}IMDB rating</p>
</div>

    </header>
 <section>
  <div className="rating">  <StarRating maxRating={10} size={25}/></div>

  <p><em>{plot}</em></p>
  <p>Starring {actors}</p>
  <p>Directed by {director}</p>
 </section> */}

  </div>

}
function ErrorMessage({fetchingError}){
  return <p className="error">{fetchingError}</p>
}
function Loader(){
  return <p className="loader">Loading...</p>
}

function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>usePopcorn</h1>
</div>
}
function SearchBar({query,setQuery}){
 

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
    {/* <SearchBar/> */}
{children}
</nav>)
}

function WatchedMovieList({watched ,movies ,onDeleteWatchedMovie}){
  return ( <ul className="list">
    {watched.map((movie) => (
     <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatchedMovie={onDeleteWatchedMovie}/>
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
        <span>{avgImdbRating.toFixed(2)}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating.toFixed(2)}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime.toFixed(2)} min</span>
      </p>
    </div>
  </div>
)
}
function WatchedMovie({movie,onDeleteWatchedMovie}){
  return ( <li >
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
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
      <button className="btn-delete" onClick={()=>onDeleteWatchedMovie(movie.imdbID)}>X</button>
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
function MovieList({movies ,onSelectMovie}){
 
  return ( <ul className="list list-movies">
    {movies?.map((movie) => (
     <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie}/>
    ))}
  </ul>)
}

function Movie({movie , onSelectMovie}){
  return ( <li onClick={()=> onSelectMovie(movie.imdbID)}>
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