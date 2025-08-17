import styles from '../styles/widgets.module.css';
import User from '../../public/user.png';
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Widgets() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notes, setNotes] = useState(
    localStorage.getItem("userNotes") || 
    "This is how I am going to learn MERN Stack in next 3 months."
  );
  const [weather, setWeather] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [time, setTime] = useState({ hours: 5, minutes: 8, seconds: 56 });
  const [timerActive, setTimerActive] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "KK Vinay",
    email: "Vinay090@gmail.com",
    username: "vinay060"
  };

  const getSelectedGenres = () => {
    if (location.state && location.state.selected) {
      const selectedGenres = location.state.selected.map(item => item.title);
      localStorage.setItem("selectedMovies", JSON.stringify(selectedGenres));
      return selectedGenres;
    }
    
    const storedGenres = localStorage.getItem("selectedMovies");
    if (storedGenres) {
      try {
        const parsed = JSON.parse(storedGenres);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'object' && parsed[0].title) {
            const genres = parsed.map(item => item.title);
            localStorage.setItem("selectedMovies", JSON.stringify(genres));
            return genres;
          } else if (typeof parsed === 'string') {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error parsing stored genres:', e);
      }
    }
    
    return [];
  };

  const genres = getSelectedGenres();
  const divRef = useRef(null);

  const handleNotes = (e) => {
    const newNotes = e.target.innerText;
    setNotes(newNotes);
    localStorage.setItem("userNotes", newNotes);
  };

  useEffect(() => {
    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes && divRef.current) {
      setNotes(savedNotes);
      divRef.current.innerText = savedNotes;
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&timezone=auto'
        );
        const data = await response.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m * 3.6),
          pressure: Math.round(data.current.surface_pressure)
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather({
          temperature: 24,
          humidity: 85,
          windSpeed: 37,
          pressure: 1019
        });
      }
    };
    fetchWeather();
  }, []);

  const GNEWS_API_KEY = 'd564f39d6c1916192ff167fdd722d823';

  const fetchGNews = async (page = 1) => {
    setNewsLoading(true);
    try {
      console.log('Fetching news with GNews API, page:', page);
      
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=10&page=${page}&token=${GNEWS_API_KEY}`
      );
      
      console.log('GNews API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`GNews API error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('GNews API Response:', data);
      
      if (data.articles && data.articles.length > 0) {
        const validArticles = data.articles.filter(article => 
          article.title && 
          article.description &&
          article.title.trim() !== '' &&
          article.description.trim() !== ''
        );
        
        if (page === 1) {
          setNewsList(validArticles);
          setCurrentNewsIndex(0);
        } else {
          setNewsList(prev => [...prev, ...validArticles]);
        }
        
        console.log('Successfully loaded news articles:', validArticles.length);
      } else {
        console.error('No articles in GNews response');
        throw new Error('No articles returned from GNews API');
      }
    } catch (error) {
      console.error('GNews fetch error:', error);
      
      if (page === 1) {
        setNewsList([
          {
            title: "India's Tech Sector Shows Remarkable Growth",
            description: "India's technology sector continues to demonstrate robust growth with new startups emerging across AI, fintech, and e-commerce domains, creating thousands of jobs.",
            image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            url: "https://example.com/tech-growth",
            source: { name: "Tech Today India" },
            publishedAt: new Date().toISOString()
          },
          {
            title: "Climate Change: New Renewable Energy Initiative",
            description: "Government announces ambitious renewable energy targets with new solar and wind projects to reduce carbon emissions by 50% in the next decade.",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            url: "https://example.com/renewable-energy",
            source: { name: "Green India" },
            publishedAt: new Date().toISOString()
          },
          {
            title: "Digital India: E-governance Reaches New Milestone",
            description: "Digital India initiative achieves major milestone with 95% of government services now available online, improving citizen access nationwide.",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            url: "https://example.com/digital-governance",
            source: { name: "Digital India Today" },
            publishedAt: new Date().toISOString()
          },
          {
            title: "Healthcare Revolution: Telemedicine Expansion",
            description: "Telemedicine services expand to rural areas, providing quality healthcare access to underserved communities across the country.",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            url: "https://example.com/healthcare",
            source: { name: "Health India" },
            publishedAt: new Date().toISOString()
          },
          {
            title: "Space Achievement: ISRO's Latest Mission Success",
            description: "ISRO successfully launches advanced communication satellite, strengthening India's position as a leading space technology nation globally.",
            image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            url: "https://example.com/isro-success",
            source: { name: "Space India" },
            publishedAt: new Date().toISOString()
          }
        ]);
        setCurrentNewsIndex(0);
      }
    }
    setNewsLoading(false);
  };

  useEffect(() => {
    fetchGNews();
  }, []);

  const handleNextNews = async () => {
    if (currentNewsIndex + 1 >= newsList.length) {
      const nextPage = Math.floor(newsList.length / 10) + 1;
      await fetchGNews(nextPage);
      if (newsList.length > currentNewsIndex + 1) {
        setCurrentNewsIndex(currentNewsIndex + 1);
      } else {
        setCurrentNewsIndex(0);
      }
    } else {
      setCurrentNewsIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleNewsCardClick = () => {
    const currentNews = newsList[currentNewsIndex];
    if (currentNews && currentNews.url && currentNews.url !== '#') {
      window.open(currentNews.url, '_blank');
    }
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && (time.hours > 0 || time.minutes > 0 || time.seconds > 0)) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          } else if (prevTime.minutes > 0) {
            return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
          } else if (prevTime.hours > 0) {
            return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
          } else {
            setTimerActive(false);
            return { hours: 0, minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, time]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${month}-${day}-${year}    ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleBrowseClick = () => {
    navigate('/movies');
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img src={User} alt="Profile" className={styles.profileImage} />
            <div className={styles.profileInfo}>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.username}</p>
            </div>
          </div>
          <div className={styles.genreTags}>
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <span key={index} className={styles.tag}>{genre}</span>
              ))
            ) : (
              <span className={styles.noGenres}>No genres selected</span>
            )}
          </div>
        </div>

        <div className={styles.notesCard}>
          <h3>All notes</h3>
          <div 
            ref={divRef}
            contentEditable={true}
            onInput={handleNotes}
            onPaste={handlePaste}
            className={styles.notesContent}
            suppressContentEditableWarning={true}
            placeholder="Start typing your notes here..."
          >
          </div>
        </div>

        <div className={styles.weatherCard}>
          <div className={styles.dateTime}>{getCurrentDateTime()}</div>
          <div className={styles.weatherMain}>
            <div className={styles.weatherIcon}>🌧️</div>
            <div className={styles.temperature}>{weather?.temperature || 24}°C</div>
          </div>
          <div className={styles.weatherCondition}>Heavy rain</div>
          <div className={styles.weatherDetails}>
            <div className={styles.weatherDetail}>
              <div className={styles.weatherValue}>
                <span className={styles.weatherSymbol}>🌬️</span>
                <span>{weather?.windSpeed || 37} km/h</span>
              </div>
              <span className={styles.weatherLabel}>Wind</span>
            </div>
            <div className={styles.weatherDetail}>
              <div className={styles.weatherValue}>
                <span className={styles.weatherSymbol}>📏</span>
                <span>{weather?.pressure || 1019} mbar</span>
              </div>
              <span className={styles.weatherLabel}>Pressure</span>
            </div>
            <div className={styles.weatherDetail}>
              <div className={styles.weatherValue}>
                <span className={styles.weatherSymbol}>💧</span>
                <span>{weather?.humidity || 85}%</span>
              </div>
              <span className={styles.weatherLabel}>Humidity</span>
            </div>
          </div>
        </div>

        {newsList.length > 0 && (
          <div className={styles.newsCard}>
            <div 
              className={styles.newsImageSection}
              onClick={handleNewsCardClick}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={newsList[currentNewsIndex].image || newsList[currentNewsIndex].urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"} 
                alt="News" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
                }}
              />
              <div className={styles.newsOverlay}>
                <h3>{newsList[currentNewsIndex].title}</h3>
              </div>
            </div>
            <div className={styles.newsContentSection}>
              <p onClick={handleNewsCardClick} style={{ cursor: 'pointer' }}>
                {newsList[currentNewsIndex].description || "No description available."}
              </p>
              <div className={styles.newsActions}>
                <span className={styles.newsIndex}>
                  {currentNewsIndex + 1} / {newsList.length}
                </span>
                <button 
                  className={styles.nextNewsButton} 
                  onClick={handleNextNews}
                  disabled={newsLoading}
                  title="Next news"
                >
                  {newsLoading ? '...' : '→'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.timerCard}>
          <div className={styles.timerDisplay}>
            <div className={styles.timerCircle}>
              <div className={styles.timerTime}>
                {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <div className={styles.timerControls}>
            <div className={styles.timeInputs}>
              <div className={styles.timeInput}>
                <span className={styles.timeLabel}>Hours</span>
                <div className={styles.inputControl}>
                  <button onClick={() => setTime(prev => ({...prev, hours: Math.min(23, prev.hours + 1)}))}>▲</button>
                  <span className={styles.timeValue}>{String(time.hours).padStart(2, '0')}</span>
                  <button onClick={() => setTime(prev => ({...prev, hours: Math.max(0, prev.hours - 1)}))}>▼</button>
                </div>
              </div>
              
              <div className={styles.separator}>:</div>
              
              <div className={styles.timeInput}>
                <span className={styles.timeLabel}>Minutes</span>
                <div className={styles.inputControl}>
                  <button onClick={() => setTime(prev => ({...prev, minutes: Math.min(59, prev.minutes + 1)}))}>▲</button>
                  <span className={styles.timeValue}>{String(time.minutes).padStart(2, '0')}</span>
                  <button onClick={() => setTime(prev => ({...prev, minutes: Math.max(0, prev.minutes - 1)}))}>▼</button>
                </div>
              </div>
              
              <div className={styles.separator}>:</div>
              
              <div className={styles.timeInput}>
                <span className={styles.timeLabel}>Seconds</span>
                <div className={styles.inputControl}>
                  <button onClick={() => setTime(prev => ({...prev, seconds: Math.min(59, prev.seconds + 1)}))}>▲</button>
                  <span className={styles.timeValue}>{String(time.seconds).padStart(2, '0')}</span>
                  <button onClick={() => setTime(prev => ({...prev, seconds: Math.max(0, prev.seconds - 1)}))}>▼</button>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className={styles.startButton}
            onClick={() => setTimerActive(!timerActive)}
          >
            {timerActive ? 'Stop' : 'Start'}
          </button>
        </div>

      </div>
      
      <button className={styles.browseButtonFixed} onClick={handleBrowseClick}>
        Browse
      </button>
    </div>
  );
}
