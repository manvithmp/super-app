import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/movies.module.css';
import User from '../../public/user.png';

const Movies = () => {
  const navigate = useNavigate();
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState({});
  const [currentPage, setCurrentPage] = useState({});

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "KK Vinay",
    email: "Vinay090@gmail.com",
    username: "vinay060"
  };

  const TMDB_API_KEY = '3204bc18d055d3cb4b3697b312beb8c3';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  const genreMapping = {
    'Action': 28,
    'Thriller': 53,
    'Horror': 27,
    'Drama': 18,
    'Comedy': 35,
    'Romance': 10749,
    'Western': 37,
    'Fantasy': 14,
    'Fiction': 878, 
    'Music': 10402
  };

  useEffect(() => {
    fetchMoviesByGenre();
  }, []);

  const fetchMoviesByGenre = async () => {
    setLoading(true);
    const genreMovies = {};
    const initialPages = {};

    const selectedGenres = JSON.parse(localStorage.getItem("selectedMovies")) || [];
    
    if (selectedGenres.length === 0) {
      setLoading(false);
      return;
    }

    try {
      for (const genreName of selectedGenres) {
        const genreId = genreMapping[genreName];
        if (genreId) {
          const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1&language=en-US`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            genreMovies[genreName] = data.results.slice(0, 4); 
            initialPages[genreName] = 1;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (selectedGenres.includes('Action')) {
        genreMovies['Action'] = [
          { id: 1, title: 'Black Adam', poster_path: '/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg' },
          { id: 2, title: 'Eternals', poster_path: '/b6qUu00iIIkXX13szFy7d0CKTwq.jpg' },
          { id: 3, title: 'Top Gun: Maverick', poster_path: '/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
          { id: 4, title: 'Tenet', poster_path: '/k68nPLbIST6NP96JmTxmZijEvCA.jpg' }
        ];
      }
      if (selectedGenres.includes('Thriller')) {
        genreMovies['Thriller'] = [
          { id: 5, title: 'Oxygen', poster_path: '/p6k1Ao8f1cWzlhUa9C5nCEFzVlp.jpg' },
          { id: 6, title: 'Smile', poster_path: '/aPqcQwu4VGEewPhagWNncDbJ9Xp.jpg' },
          { id: 7, title: 'The Gray Man', poster_path: '/1uzO56ZbOSkFeNZIKE2IWZzBdCU.jpg' },
          { id: 8, title: 'The Menu', poster_path: '/v31MsWhF9WIG7Pwiwh6jnPCQYeq.jpg' }
        ];
      }
      if (selectedGenres.includes('Horror')) {
        genreMovies['Horror'] = [
          { id: 9, title: 'Megan', poster_path: '/d9nBoowhjiiYc4FBNtQkPbE4hbuk7Yqk5F0LuD.jpg' },
          { id: 10, title: 'The Invitation', poster_path: '/5evvgyLhkPbE4hbuk7Yqk5F0LuD.jpg' },
          { id: 11, title: 'Orphan: First Kill', poster_path: '/pHkKbIRoCe7zIFvqan9LFSaQAde.jpg' },
          { id: 12, title: 'Ouija', poster_path: '/oxoWnfcw2AhgeiPf6VABQkhe6GF.jpg' }
        ];
      }
    }

    setMoviesByGenre(genreMovies);
    setCurrentPage(initialPages);
    setLoading(false);
  };

  const loadMoreMovies = async (genreName) => {
    const genreId = genreMapping[genreName];
    if (!genreId) return;

    setLoadingMore(prev => ({ ...prev, [genreName]: true }));
    
    const nextPage = (currentPage[genreName] || 1) + 1;

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${nextPage}&language=en-US`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setMoviesByGenre(prev => ({
          ...prev,
          [genreName]: [...prev[genreName], ...data.results.slice(0, 4)]
        }));
        
        setCurrentPage(prev => ({
          ...prev,
          [genreName]: nextPage
        }));
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    }

    setLoadingMore(prev => ({ ...prev, [genreName]: false }));
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading movies...</div>
      </div>
    );
  }

  if (Object.keys(moviesByGenre).length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h1>Super app</h1>
          </div>
          <div className={styles.userProfile}>
            <img src={User} alt="Profile" className={styles.profileImage} />
          </div>
        </div>
        <div className={styles.noGenres}>
          <h2>No genres selected</h2>
          <p>Please go back and select some genres to see movies.</p>
          <button onClick={() => navigate('/genre')} className={styles.selectGenresBtn}>
            Select Genres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Super app</h1>
        </div>
        <div className={styles.userProfile}>
          <img src={User} alt="Profile" className={styles.profileImage} />
        </div>
      </div>

      <div className={styles.subtitle}>
        <h2>Entertainment according to your choice</h2>
      </div>

      <div className={styles.content}>
        {Object.entries(moviesByGenre).map(([genreName, movies]) => (
          <div key={genreName} className={styles.genreSection}>
            <div className={styles.genreHeader}>
              <h3 className={styles.genreTitle}>{genreName}</h3>
              <button 
                className={styles.viewMoreBtn}
                onClick={() => loadMoreMovies(genreName)}
                disabled={loadingMore[genreName]}
              >
                {loadingMore[genreName] ? 'Loading...' : 'View More'}
              </button>
            </div>
            <div className={styles.moviesGrid}>
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className={styles.movieCard}
                  onClick={() => handleMovieClick(movie)}
                >
                  <img
                    src={movie.poster_path 
                      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                      : '/placeholder-movie.jpg'
                    }
                    alt={movie.title}
                    className={styles.moviePoster}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x750/333/fff?text=No+Image';
                    }}
                  />
                  <div className={styles.movieTitle}>
                    <h4>{movie.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
