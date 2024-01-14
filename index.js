document.querySelector('.fa-magnifying-glass')
    .addEventListener('click', function() {
        document.querySelector('.search-field').focus()
    })

const searchField = document.querySelector('.search-field')
const searchButton = document.querySelector('.search-btn')
const mainSection = document.querySelector('.main-section')
const moviePlot = document.querySelector('.movie-plot')
const defaultState = document.querySelector('.default-state')
const watchlistButton = document.querySelector('.watchlist-btn')

const myWatchlist = JSON.parse(localStorage.getItem('myWatchlist')) || []
let movieIDsArray = []
let movieHtml = ''
let plotHtml = ''
let movieArray = []
let fullPlotVisible = false

document.querySelector('.watchlist-link')
    .addEventListener('click', () => {
         window.location.href = 'watchlist.html';
    }) 

searchButton.addEventListener('click', e => {
    e.preventDefault()
    mainSection.innerHTML = ''
    movieIDsArray = []
     
    if (searchField.value) {
        fetch(`https://www.omdbapi.com/?s=${searchField.value}&apikey=3c48d801`)
            .then(response => response.json())
            .then(data => {
                    searchField.value = ''
                    movieArray = data.Search
                    if (movieArray) {
                        defaultState.classList.add('disabled')
                        movieArray.forEach(movie => {
                        movieIDsArray.push(movie.imdbID)
                        })
                        
                        movieIDsArray.forEach(async id => {
                            const movieContainer = document.createElement('div')
                            const plotContainer = document.createElement('div')
                            movieContainer.classList.add('movie-container')
                            plotContainer.classList.add('plot-container')
                            mainSection.appendChild(movieContainer)
                            mainSection.appendChild(plotContainer)
                            renderMovies(id, movieContainer, plotContainer) 
                        })
                    } else if (data.Error === 'Movie not found!'){
                            document.querySelector('.start-exploring')
                                .innerHTML = `Unable to find what you’re looking for. Please try another search.`
                      }    
                    
            })  
    }    
})     

document.addEventListener('click', e => {
    e.preventDefault()
    const parentElement = e.target.parentNode;
    if (e.target.dataset.watch) {
        if (!myWatchlist.includes(e.target.dataset.watch))
        myWatchlist.push(e.target.dataset.watch)
        e.target.parentNode.innerHTML = '<i class="fa-solid fa-check"></i> Added to Watchlist'
        localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist))
    }
})
 
function renderMovies(id, movieContainer, plotContainer) {
    const plotParameter = mediaQuery.matches ? '&plot=full' : '';
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=3c48d801${plotParameter}`)
        .then(response => response.json())
        .then(data => {
             movieHtml = `
                    <div class="image-container">
                        ${data.Poster !== 'N/A' ? `<img class="movie-image" src="${data.Poster}">` : 'No image available'}
                    </div>
                    <div class="movie-info-right-container">
                        <div class="title-stars-container">
                            <div class="movie-title">${data.Title}</div>
                            <div class="stars-container">
                                <i class="fa-solid fa-star"></i> ${data.imdbRating} stars
                            </div>
                        </div>
                        <div class="movie-details-container">
                            <div class="runtime">${data.Runtime}</div>
                            <div>${data.Genre}</div>
                        </div>
                        <div class="watchlist-container">
                            <button id="watchlist-btn" class="watchlist-btn" data-watch="${data.imdbID}">+</button>
                            <p>WATCHLIST</p>
                        </div>
                    </div>
                ` 
            plotHtml = `
                <div class="plot">
                    ${data.Plot}
                </div>
            `
            movieContainer.innerHTML = movieHtml
            plotContainer.innerHTML = plotHtml
        })
}

const mediaQuery = window.matchMedia('(min-width: 600px)');


/* if (mediaQuery.matches) {
    console.log('window is at least 600px')
} else {
    console.log('window is less than 600px')
}

*/