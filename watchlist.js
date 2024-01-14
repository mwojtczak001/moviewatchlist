const myWatchlist = JSON.parse(localStorage.getItem('myWatchlist')) || []
const displayWatchlist = document.querySelector('.display-watchlist')
const mediaQuery = window.matchMedia('(min-width: 600px)');
let movieHtml = ''
let plotHtml = ''
const addSomeMoviesBtn = document.querySelector('.add-some-movies-button')

document.querySelector('.empty-watchlist-display').classList.remove('hidden')
renderWatchlist();

function loadIndex() {
    window.location.href = 'index.html' 
}

document.querySelector('.search-for-movies-link')
    .addEventListener('click', () => {
        loadIndex()
    })

function renderWatchlist() {
    displayWatchlist.innerHTML = '';
    
    if (myWatchlist.length === 0) {
        document.querySelector('.empty-watchlist-display').style.setProperty('display', 'flex', 'important');
        console.log('Empty Watchlist: Show');
        return
    } else {
        console.log('Empty Watchlist: Hide');
        document.querySelector('.empty-watchlist-display').style.setProperty('display', 'none', 'important');
    }

    for (let movie of myWatchlist) {
        const plotParameter = mediaQuery.matches ? '&plot=full' : '';
        fetch(`https://www.omdbapi.com/?i=${movie}&apikey=3c48d801${plotParameter}`)
            .then(response => response.json())
            .then(data => {
                const watchlistMovieContainer = document.createElement('div')
                const watchlistPlotContainer = document.createElement('div')
                watchlistMovieContainer.classList.add('movie-container')
                watchlistPlotContainer.classList.add('plot-container')
                displayWatchlist.appendChild(watchlistMovieContainer)
                displayWatchlist.appendChild(watchlistPlotContainer)
                
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
                                <button id="remove-btn" class="remove-btn" data-watch="${data.imdbID}">-</button>
                                <p>REMOVE</p>
                            </div>
                        </div>
                    ` 
                plotHtml = `
                    <div class="plot">
                        ${data.Plot}
                    </div>
                `
                
                watchlistMovieContainer.innerHTML = movieHtml
                watchlistPlotContainer.innerHTML = plotHtml
            })
    }
}

document.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.dataset.watch) {
        const IDToRemove = e.target.dataset.watch
        let indexToRemove = myWatchlist.indexOf(IDToRemove)
        if (indexToRemove !== -1) {
            myWatchlist.splice(indexToRemove, 1)
            localStorage.setItem('myWatchlist', JSON.stringify(myWatchlist));
            renderWatchlist()
        }     
    }
}) 

addSomeMoviesBtn.addEventListener('click', () => { 
    loadIndex()
})