import React, { useState } from "react";
import styles from "../styles/genre.module.css";
import { useNavigate } from "react-router-dom";

const CARDS = [
    { id: 1, title: "Action", image: "./action.png",bg: "#FF5209" },
    { id: 2, title: "Drama", image: "./drama.png", bg: "#D7A4FF" },
    { id: 3, title: "Romance", image: "./romance.png", bg: "#148A08" },
    { id: 4, title: "Thriller", image: "./thriller.png", bg: "#84C2FF" },
    { id: 5, title: "Western", image: "./western.png", bg: "#902500" },
    { id: 6, title: "Horror", image: "./horror.png", bg: "#7358FF" },
    { id: 7, title: "Fantasy", image: "./fantasy.png", bg: "#FF4ADE" },
    { id: 8, title: "Music", image: "./music.png", bg: "#E61E32" },
    { id: 9, title: "Fiction", image: "./fiction.png", bg: "#6CD061" }
];

const Genre = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);

    const handleSelect = (card) => {
        if (selected.some((item) => item.id === card.id)) {
            setSelected(selected.filter((item) => item.id !== card.id));
        } else {
            setSelected([...selected, card]);
        }
    };

    const handleNextPage = () => {
        if (selected.length < 3) return;
        navigate("/widgets", { state: { selected } });  
    };

    return (
        <div className={styles.container}>
            
            <div className={styles.left}>
                <h1 className={styles.title}>Super App</h1>
                <h2 className={styles.subtitle}>Choose your<br /> entertainment<br /> category</h2>

                <div className={styles.selected}>
                    {selected.map((item) => (
                        <span className={styles.selectedItem} key={item.id}>
                            {item.title} <span className={styles.remove} onClick={() => handleSelect(item)}>X</span>
                        </span>
                    ))}
                </div>

                {selected.length < 3 && <p className={styles.error}>⚠ Minimum 3 categories required</p>}
            </div>

           
            <div className={styles.right}>
                {CARDS.map((card) => (
                    <div
                        key={card.id}
                        className={`${styles.card} ${selected.some((item) => item.id === card.id) ? styles.selectedCard : ""}`}
                        style={{ backgroundColor: card.bg }}
                        onClick={() => handleSelect(card)}
                    >
                        <h3>{card.title}</h3>
                        <img src={card.image} alt={card.title} />
                    </div>
                ))}
            </div>

           
            <button className={styles.nextButton} onClick={handleNextPage} disabled={selected.length < 3}>
                Next Page
            </button>
        </div>
    );
};

export default Genre;
