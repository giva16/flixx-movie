//User Interface
const popularDiv = document.querySelector('.grid');

// Router
const global = {
  currentPage: window.location.pathname
};


/**************FEATURE: DISPLAY POPULAR MOVIES AND SHOWS**********/

// reformat release/air dates to dd/mm/yyyy
const getDate = (date) => {
  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
}

// Create cards to represent displayed movies or shows
function createCard(title, date, imagePath, id) {
  const div = document.createElement('div');
  const poster = createPoster(imagePath, title, id);
  const body = createCardBody(title, date);

  div.classList.add('card');
  div.appendChild(poster);
  div.appendChild(body);

  return div;
}

//create movie card body text section
function createCardBody(title, date) {
  const cardBody = document.createElement('div')
  const cardTitle = document.createElement('h5');
  const cardText = document.createElement('p');
  const cardDate = document.createElement('small');

  cardTitle.classList.add('card-title');
  cardBody.classList.add('card-body');
  cardText.classList.add('card-text');
  cardDate.classList.add('text-muted');

  cardTitle.textContent = title;
  cardDate.textContent = global.currentPage === '/shows.html'?
                                                `Aired: ${getDate(date)}`:
                                                `Release: ${getDate(date)}`

  cardBody.appendChild(cardTitle);
  cardText.appendChild(cardDate);
  cardBody.appendChild(cardText);
  
  return cardBody;
}

// create the poster for a movie/show card
function createPoster(imagePath, title, id){
  const link = document.createElement('a');
  const image = document.createElement('img');

  // create movie/tv show link to add to poster depending on the current page
  const detailsURL = global.currentPage === '/shows.html' ?
                     `tv-details.html?=${id}`: `movie-details.html?=${id}`;
  
  image.setAttribute('src', `https://image.tmdb.org/t/p/w500/${imagePath}`);
  image.classList.add('card-img-top');
  image.setAttribute('alt', title);
  link.setAttribute('href', detailsURL);

  link.appendChild(image);

  return link;
}

// display 20 popular movies on home page
async function displayPopularMovies() {
  const results = await fetchAPIData('movie/popular');
  const moviesData = results.results;
  
  // create a card for each movie and add it to DOM
  moviesData.forEach(movie => {
    const movieCard = createCard(movie.title, movie.release_date, movie.poster_path, movie.id);
    popularDiv.appendChild(movieCard);
  })
}

// display 20 popular tv shows on tv shows page
async function displayPopularTvShows() {
  const results = await fetchAPIData('tv/popular');
  const tvData = results.results;
  
  // create a card for each movie and add it to DOM
  tvData.forEach(tvShow => {
    const tvShowCard = createCard(tvShow.original_name, 
                                tvShow.first_air_date, 
                                tvShow.poster_path, 
                                tvShow.id);
    popularDiv.appendChild(tvShowCard);
  })
}

/******** UTILITY FUNCTIONS ********/

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  // ALWAYS STORE YOUR API KEY ON AN ENVIRONMENTAL VARIABLE
  // AND MAKE YOUR REQUESTS FROM A SERVER TO AVOID SECURITY LEAKS
  const API_URL = 'https://api.themoviedb.org/3/'
  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjUzMjZjNDYzYzNkOWI3NjRhOWNmYTQ0ODdmZjhlOSIsInN1YiI6IjY1Y2QyMmIyYzM5MjY2MDE2MmJmYzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0XW4IkrnSceIn4sIchYY4XX-0ie0hpPVC9HpwlyznhA';

  showSpinner();
  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  });

  const data = await response.json();

  hideSpinner();

  return data;
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// highlight active link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularTvShows();
      break;
    case '/movie-details.html':
      console.log('Movie-details');
      break;
    case '/tv-details.html':
      console.log('Shows-details');
      break;
    case '/search.html':
      console.log('Search Page');
      break;

  }
  highlightActiveLink();
}


document.addEventListener('DOMContentLoaded', init);