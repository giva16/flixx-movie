//User Interface
const popularDiv = document.querySelector('.grid');

// Router
const global = {
  currentPage: window.location.pathname
};

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

function createImage(image, imagePath, title) {
  image.classList.add('card-img-top');
  image.setAttribute('src', `https://image.tmdb.org/t/p/w500/${imagePath}`);
  image.setAttribute('alt', title);
}

// reformat release/air dates to dd/mm/yyyy
const getDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
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
      displayMovieDetails();
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

/**************FEATURE: DISPLAY POPULAR MOVIES AND SHOWS**********/

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
  
  createImage(image, imagePath, title);
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

/******* FEATURE: SHOW MOVIE DETAILS*********/
async function displayMovieDetails() {
  // gets movie id from URL search (minus the query prefix)
  const movieId = window.location.search.slice(2); 
  const movieDetails = await fetchAPIData(`movie/${movieId}`);
  const upperDetails = document.querySelector('.details-top');
  const lowerDetails = document.querySelector('.details-bottom');

  updateUpperDetails(upperDetails, movieDetails);
  updateLowerDetails(lowerDetails, movieDetails);
  console.log(movieDetails);
}

// Update the Image, title, rating, date, description, and Genre to match queried movie
function updateUpperDetails(upperDetails, movieDetails) {
  const image = upperDetails.querySelector('img');
  const title = upperDetails.querySelector('h2');
  const rating = upperDetails.querySelector('p');
  const date = upperDetails.querySelector('p.text-muted');
  const overview = upperDetails.querySelector('p.overview');
  const genres = upperDetails.querySelectorAll('li');
  updateGenresList(genres, movieDetails.genres);

  createImage(image, movieDetails.poster_path, movieDetails.title);
  title.textContent = movieDetails.title;
  date.textContent = `Release Date: ${getDate(movieDetails.release_date)}`;
  overview.textContent = movieDetails.overview;
  rating.innerHTML = `<p>
                        <i class="fas fa-star text-primary"></i>
                        ${Math.round(movieDetails.vote_average * 10) / 10} / 10
                      </p>`;
}

function updateGenresList(oldGenres, newGenres) {
  const parent = oldGenres[0].parentElement;

  oldGenres.forEach(genre => {
    genre.remove();
  });

  newGenres.forEach(genre => {
    const li = document.createElement('li');
    const text = document.createTextNode(genre.name);
    
    li.appendChild(text);
    parent.appendChild(li);
  });
}

function commaThousands(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function updateLowerDetails(lowerDetails, movieDetails) {
  const infoList = lowerDetails.querySelector('ul');
  const productionList = lowerDetails.querySelector('.list-group');
  
  infoList.innerHTML = `
    <li><span class="text-secondary">Budget:</span> $${commaThousands(movieDetails.budget)}</li>
    <li><span class="text-secondary">Revenue:</span> $${commaThousands(movieDetails.revenue)}</li>
    <li><span class="text-secondary">Runtime:</span> ${movieDetails.runtime} minutes</li>
    <li><span class="text-secondary">Status:</span> ${movieDetails.status}</li>`;
  
    productionList.textContent = '';
    movieDetails.production_companies.forEach(company => {
      productionList.textContent += `${company.name}, `;
    });
    productionList.textContent = productionList.textContent.slice(0, -2); // get rid of extra comma

}