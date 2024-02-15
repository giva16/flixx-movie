//User Interface

// Router
const global = {
  currentPage: window.location.pathname
};

// display popular movies on home page
async function displayPopularMovies() {
  const results = await fetchAPIData('movie/popular');
  console.log(typeof results.results);
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjUzMjZjNDYzYzNkOWI3NjRhOWNmYTQ0ODdmZjhlOSIsInN1YiI6IjY1Y2QyMmIyYzM5MjY2MDE2MmJmYzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0XW4IkrnSceIn4sIchYY4XX-0ie0hpPVC9HpwlyznhA';
  const API_URL = 'https://api.themoviedb.org/3/'

  const response = await fetch(`${API_URL}${endpoint}?language=en-US`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  });

  const data = await response.json();

  return data;
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
      console.log('Home');
      break;
    case '/shows.html':
      console.log('Shows');
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
  displayPopularMovies();
}


document.addEventListener('DOMContentLoaded', init);