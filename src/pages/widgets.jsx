import styles from '../styles/widgets.module.css';
import User from '../../public/user.png';
import { useRef, useState, useEffect } from "react";
import { getNews } from '../services';

export default function Widgets() {
  const [notes, setNotes] = useState("");
  const [news, setNews] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "KK Vinay",
    email: "vinay060@gmail.com",
    username: "vinay060"
  };
  const movies = JSON.parse(localStorage.getItem("selectedMovies")) || [
    { id: 1, title: "Thriller" },
    { id: 2, title: "Action" },
    { id: 3, title: "Fiction" },
  ];

  const divRef = useRef(null);

  // Handle text changes in notes
  const handleNotes = (e) => {
    setNotes(e.target.innerText);
  };

  // Fetch news
  useEffect(() => {
    getNews().then((res) => {
      setNews(res?.articles?.[0] || null);
    });
  }, []);

  return (
    <div
      className={styles.widgets}
      style={{
        maxHeight: "100vh",
        overflowY: "hidden",
        padding: "2rem",
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* TOP SECTION (Grid with user card, orange box, notes box, pink box) */}
      <div
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
        }}
      >
        {/* Left column: user card (top), orange box (bottom) */}
        <div
          style={{
            gap: "2rem",
            gridRow: "1",
            display: "grid",
            gridTemplateRows: "60% 40%",
            gridTemplateColumns: "1fr",
          }}
        >
          {/* PURPLE USER CARD */}
          <div
            style={{
              backgroundColor: "#5746EA",
              display: "flex",
              gap: "1rem",
              borderRadius: "24px",
              padding: "2rem",
              alignItems: "center",
            }}
          >
            <img
              src={User}
              alt="user"
              width={100}
              height={100}
              style={{ borderRadius: "24px", objectFit: "cover" }}
            />
            <div>
              <h1 style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "28px", margin: 0 }}>
                {user?.name}
              </h1>
              <p style={{ color: "#FFFFFF", fontSize: "14px", margin: "4px 0" }}>
                {user?.email}
              </p>
              <p style={{ color: "#FFFFFF", fontSize: "14px", margin: 0 }}>
                {user?.username}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.75rem",
                }}
              >
                {movies?.map((movie) => (
                  <div
                    key={movie.id}
                    style={{
                      backgroundColor: "#9F94FF",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "10px",
                    }}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ORANGE BOX (could be for weather/time or anything else) */}
          <div
            style={{
              backgroundColor: "orange",
              borderRadius: "24px",
              padding: "1rem",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#000" }}>
              Weather / Time
            </h3>
            <p style={{ margin: 0 }}>Heavy rain</p>
            <p style={{ margin: 0 }}>24°C</p>
            <p style={{ margin: 0 }}>2-20-2023 07:35 PM</p>
          </div>
        </div>

        {/* Right column: big notes box (contentEditable) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f5",
            borderRadius: "24px",
            padding: "1rem",
          }}
        >
          <h2 style={{ margin: 0, marginBottom: "0.5rem", color: "#000" }}>All notes</h2>
          <div
            ref={divRef}
            onClick={() => {
              divRef.current.focus();
            }}
            contentEditable={true}
            onInput={handleNotes}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "1rem",
              minHeight: "150px",
              color: "#000",
              outline: "none",
              border: "2px solid #ddd",
            }}
          >
            {notes}
          </div>
        </div>

        {/* PINK BOX across both columns (countdown/timer, etc.) - reduced size */}
        <div
          style={{
            backgroundColor: "pink",
            gridColumn: "1 / -1",
            borderRadius: "24px",
            padding: "1.5rem", // reduced from 2rem
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#000", margin: 0, fontSize: "1.8rem" }}>05:09:00</h2>
          <button
            style={{
              marginTop: "1rem",
              backgroundColor: "#5746EA",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              cursor: "pointer",
            }}
          >
            Start
          </button>
        </div>
      </div>

      {/* NEWS BLOCK (white box at the bottom) - reduced overall size */}
      <div
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "24px",
          overflow: "hidden",
          marginTop: "1.5rem", // slightly reduced margin
          display: "flex",
          flexDirection: "column",
        }}
      >
        {news === null ? (
          <h1 style={{ textAlign: "center", margin: "2rem" }}>Loading...</h1>
        ) : (
          <>
            {/* Image area */}
            <div
              style={{
                height: "40vh", // reduced from 50vh
                width: "100%",
                position: "relative",
              }}
            >
              <img
                src={news.urlToImage}
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
                alt="news"
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  padding: "1rem",
                }}
              >
                <p style={{ margin: 0 }}>
                  {news.description ||
                    "No description available for this article."}
                </p>
              </div>
            </div>

            {/* Text content + "Browse" button at bottom */}
            <div
              style={{
                flex: 1,
                padding: "2rem",
                overflowY: "auto",
                maxHeight: "30vh", // reduced from 40vh
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
                {news.title || "Untitled Article"}
              </h2>
              <p style={{ marginBottom: "2rem" }}>
                {news.content ||
                  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nunc vehicula orci a urna hendrerit, vel malesuada nisi
                  porta. Fusce gravida, leo eu fermentum sollicitudin, urna
                  nibh fermentum quam, sit amet bibendum nisl dolor at orci.
                  Morbi at tellus at nulla dignissim gravida.`}
              </p>

              <button
                style={{
                  display: "block",
                  margin: "0 auto",
                  backgroundColor: "#5746EA",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Browse
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
