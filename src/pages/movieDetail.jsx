import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/movieDetail.module.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  const TMDB_API_KEY = '3204bc18d055d3cb4b3697b312beb8c3';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/w1280';

  useEffect(() => {
    fetchMovieDetails();
    fetchWatchProviders();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      console.log('Fetching movie details for ID:', id);
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,reviews`
      );
      const data = await response.json();
      console.log('Movie details:', data);
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
    setLoading(false);
  };

  const fetchWatchProviders = async () => {
    try {
      console.log('Fetching watch providers for movie ID:', id);
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      console.log('Watch providers data:', data);

      const regions = ['US', 'IN', 'GB', 'CA', 'AU'];
      let providers = null;
      let selectedRegion = null;
      
      for (const region of regions) {
        if (data.results?.[region]) {
          providers = data.results[region];
          selectedRegion = region;
          console.log(`Found providers for region ${region}:`, providers);
          break;
        }
      }
      
      if (!providers && data.results) {
        const availableRegions = Object.keys(data.results);
        if (availableRegions.length > 0) {
          providers = data.results[availableRegions[0]];
          selectedRegion = availableRegions;
        }
      }
      
      setWatchProviders(providers);
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      setWatchProviders(null);
    }
  };

  const handleProviderClick = (provider, movieTitle) => {
    const providerUrls = {
      'Netflix': `https://www.netflix.com/search?q=${encodeURIComponent(movieTitle)}`,
      'Amazon Prime Video': `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(movieTitle)}`,
      'Apple TV': `https://tv.apple.com/search?term=${encodeURIComponent(movieTitle)}`,
      'Google Play Movies & TV': `https://play.google.com/store/search?q=${encodeURIComponent(movieTitle)}&c=movies`,
      'Disney Plus': `https://www.disneyplus.com/search/${encodeURIComponent(movieTitle)}`,
      'Hulu': `https://www.hulu.com/search?q=${encodeURIComponent(movieTitle)}`,
      'HBO Max': `https://www.max.com/search?q=${encodeURIComponent(movieTitle)}`,
      'Paramount Plus': `https://www.paramountplus.com/search/${encodeURIComponent(movieTitle)}`,
      'YouTube': `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle)}+movie`,
      'Vudu': `https://www.vudu.com/content/movies/search/?query=${encodeURIComponent(movieTitle)}`
    };

    const searchUrl = providerUrls[provider.provider_name] || 
                     `https://www.google.com/search?q=watch+${encodeURIComponent(movieTitle)}+on+${encodeURIComponent(provider.provider_name)}`;
    
    window.open(searchUrl, '_blank');
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading movie details...</div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Movie not found</div>
        <button onClick={() => navigate('/movies')} className={styles.backButton}>
          ← Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.backdrop}>
        <img 
          src={movieDetails.backdrop_path 
            ? `${TMDB_BACKDROP_URL}${movieDetails.backdrop_path}`
            : `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
          }
          alt={movieDetails.title}
          className={styles.backdropImage}
        />
        <div className={styles.backdropOverlay}></div>
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.movieInfo}>
          <div className={styles.posterSection}>
            <img
              src={movieDetails.poster_path 
                ? `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
                : 'https://via.placeholder.com/500x750/333/fff?text=No+Image'
              }
              alt={movieDetails.title}
              className={styles.poster}
            />
          </div>

          <div className={styles.detailsSection}>
            <h1 className={styles.title}>{movieDetails.title}</h1>
            
            {movieDetails.tagline && (
              <p className={styles.tagline}>"{movieDetails.tagline}"</p>
            )}

            <div className={styles.metaInfo}>
              <span className={styles.rating}>⭐ {movieDetails.vote_average?.toFixed(1)}/10</span>
              <span className={styles.runtime}>{formatRuntime(movieDetails.runtime)}</span>
              <span className={styles.releaseDate}>{formatDate(movieDetails.release_date)}</span>
            </div>

            <div className={styles.genres}>
              {movieDetails.genres?.map(genre => (
                <span key={genre.id} className={styles.genre}>{genre.name}</span>
              ))}
            </div>

            <div className={styles.watchProviders}>
              <h3>Where to Watch</h3>
              
              {watchProviders ? (
                <div className={styles.providersContainer}>
                  
                  {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                    <div className={styles.providerCategory}>
                      <h4>Stream</h4>
                      <div className={styles.providersList}>
                        {watchProviders.flatrate.map((provider, index) => (
                          <div 
                            key={provider.provider_id || index}
                            className={styles.providerItem}
                            onClick={() => handleProviderClick(provider, movieDetails.title)}
                          >
                            <img
                              src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                              alt={provider.provider_name}
                              className={styles.providerLogo}
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/100x100/333/fff?text=${provider.provider_name.charAt(0)}`;
                              }}
                            />
                            <span className={styles.providerName}>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {watchProviders.rent && watchProviders.rent.length > 0 && (
                    <div className={styles.providerCategory}>
                      <h4>Rent</h4>
                      <div className={styles.providersList}>
                        {watchProviders.rent.map((provider, index) => (
                          <div 
                            key={provider.provider_id || index}
                            className={styles.providerItem}
                            onClick={() => handleProviderClick(provider, movieDetails.title)}
                          >
                            <img
                              src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                              alt={provider.provider_name}
                              className={styles.providerLogo}
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/100x100/333/fff?text=${provider.provider_name.charAt(0)}`;
                              }}
                            />
                            <span className={styles.providerName}>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {watchProviders.buy && watchProviders.buy.length > 0 && (
                    <div className={styles.providerCategory}>
                      <h4>Buy</h4>
                      <div className={styles.providersList}>
                        {watchProviders.buy.map((provider, index) => (
                          <div 
                            key={provider.provider_id || index}
                            className={styles.providerItem}
                            onClick={() => handleProviderClick(provider, movieDetails.title)}
                          >
                            <img
                              src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                              alt={provider.provider_name}
                              className={styles.providerLogo}
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/100x100/333/fff?text=${provider.provider_name.charAt(0)}`;
                              }}
                            />
                            <span className={styles.providerName}>{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.justWatchAttribution}>
                    <p><small>Streaming data provided by <strong>JustWatch</strong></small></p>
                  </div>
                </div>
              ) : (
                <div className={styles.noProviders}>
                  <p>Streaming information not available for this movie.</p>
                  <button 
                    className={styles.searchButton}
                    onClick={() => window.open(`https://www.google.com/search?q=watch+${encodeURIComponent(movieDetails.title)}+online`, '_blank')}
                  >
                    Search Online
                  </button>
                </div>
              )}
            </div>

            <div className={styles.overview}>
              <h3>Overview</h3>
              <p>{movieDetails.overview}</p>
            </div>

            {movieDetails.credits?.cast && (
              <div className={styles.cast}>
                <h3>Cast</h3>
                <div className={styles.castList}>
                  {movieDetails.credits.cast.slice(0, 6).map(actor => (
                    <div key={actor.id} className={styles.castMember}>
                      <img
                        src={actor.profile_path 
                          ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
                          : 'https://via.placeholder.com/200x300/333/fff?text=No+Photo'
                        }
                        alt={actor.name}
                        className={styles.actorPhoto}
                      />
                      <div className={styles.actorInfo}>
                        <p className={styles.actorName}>{actor.name}</p>
                        <p className={styles.character}>{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movieDetails.production_companies && movieDetails.production_companies.length > 0 && (
              <div className={styles.production}>
                <h3>Production</h3>
                <p>{movieDetails.production_companies.map(company => company.name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
