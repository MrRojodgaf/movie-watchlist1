const text = document.getElementById('text')
const searchBtn = document.getElementById('search-btn')
const mode = document.getElementById('mode')
let allMovieArray = []
let myMovies = JSON.parse(localStorage.getItem("myList"))
const filterMovies = myMovies && myMovies.filter(movie => movie !== null)

mode.addEventListener('click', () =>{
    document.body.classList.toggle('black')
})


async function getMovieList(){
    const titleArray = []
    const prom = await fetch(`https://www.omdbapi.com/?s=${text.value}&apikey=786c1d7b`)
    const data = await prom.json()
    if(data.Search){
        for(let movie of data.Search){
            titleArray.push(movie.Title)
        }
        getMovieInfo(titleArray)
    }
    else {
        document.getElementById('movie-section').innerHTML = `
                    <div class="explore">
                        <i class="fa-sharp fa-solid fa-circle-xmark movie-icon"></i>
                        <p class="movie-icon-label" style="font-size: 1.5em;">${data.Error}😩</p>
                    </div>`
    }
}

function getMovieInfo(movieArr){
    allMovieArray = []
    for(let title of movieArr) {
        fetch(`https://www.omdbapi.com/?t=${title}&apikey=786c1d7b`)
        .then(res => res.json())
        .then(data => {
           allMovieArray.push(data)
           renderMovie(allMovieArray)
        })
    }    
}

function renderMovie(array){
    let render = ''
    for(let data of array){
        const savedMovie = filterMovies && filterMovies.find(saved => data.imdbID === saved.imdbID)
                render += `
                 <div class="movie-box">
                    <img class="poster" src="${data.Poster}">
                    <div class="data-container">
                    <h3>${data.Title}<span><i class="fa-solid fa-star star"></i>${data.imdbRating}</span></h3>
                    <div class="rgw-flex">
                        <p>${data.Runtime}</p>
                        <p class="runtime">${data.Genre}</p>
                        <div id="add-watchlist${data.imdbID}" class="add-watchlist">
                        ${savedMovie ? `<p class="watchlist">Added to watchlist
                                        <i class="fa-solid fa-circle-check"></i>
                                        </p>` : 
                                        `<i class="fa-solid fa-circle-plus plus-icon" data-add=${data.imdbID}></i>
                                        <p class="watchlist">Watchlist</p>`}
                        
                        </div>
                    </div>
                    <p class="plot">${data.Plot}</p>
                    </div>
                  </div>`  
        
    }
    document.getElementById('movie-section').innerHTML = render
}

let myMovie = []
searchBtn.addEventListener('click', getMovieList)
document.addEventListener('click', function(e){
    if(e.target.dataset.add){
        const clickedMovie = allMovieArray.find(movie => e.target.dataset.add === movie.imdbID)
           myMovies ? myMovies.push(clickedMovie) : myMovie.push(clickedMovie)
             localStorage.setItem("myList", JSON.stringify(myMovies ? myMovies : myMovie))
            document.getElementById(`add-watchlist${e.target.dataset.add}`).innerHTML = `<p class="watchlist">Added to watchlist<i class="fa-solid fa-circle-check"></i></p>`
            document.getElementById('num-span').innerHTML = filterMovies ? filterMovies.length += 1 : 0
    }
})
document.getElementById('num-span').innerHTML = filterMovies ? filterMovies.length : 0
