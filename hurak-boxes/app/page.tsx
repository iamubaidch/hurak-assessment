"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Box = {
    id: number;
    height: number;
    width: number;
    color: string;
};

export default function HomePage() {
    const [boxes, setBoxes] = useState<Box[]>([]);

    const [colors, setColors] = useState<string[]>([
        "red",
        "yellow",
        "green",
        "blue",
        "pink",
        "grey",
    ]);
    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        async function loadBoxes() {
            try {
                const res = await axios.get("http://localhost:8000/api/boxes", {
                    signal: controller.signal,
                });
                if (!active) return;
                setBoxes(res.data);
            } catch (e) {
                if (!axios.isCancel(e)) console.error(e);
            }
        }

        loadBoxes();
        const id = setInterval(loadBoxes, 10000);
        return () => {
            active = false;
            controller.abort();
            clearInterval(id);
        };
    }, []);

    function shuffleColors() {
        setColors((s) => [...s].sort(() => Math.random() - 0.5));
    }
    function sortBoxes() {
        setBoxes((prev) =>
            [...prev].sort(
                (a, b) => colors.indexOf(a.color) - colors.indexOf(b.color)
            )
        );
    }

    function textColor(bg: string) {
        return bg === "yellow" || bg === "pink" ? "black" : "white";
    }

    return (
        <div className="app-container">
            <div className="top-row">
                <div>
                    <h2 style={{ margin: 0 }}>Color Array</h2>
                    <p className="muted">
                        Shuffle the colors and then sort boxes to match.
                    </p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div className="muted">
                        Boxes total: <strong>{boxes.length}</strong>
                    </div>
                </div>
            </div>

            <div className="panel" style={{ marginTop: 20 }}>
                <aside className="left-panel">
                    <div className="chip-list">
                        {colors.map((c, i) => (
                            <div
                                key={c}
                                className={`chip ${
                                    textColor(c) === "black" ? "black-text" : ""
                                }`}
                                style={{ backgroundColor: c }}
                            >
                                {i + 1}. {c}
                            </div>
                        ))}
                    </div>

                    <div className="controls">
                        <button className="btn" onClick={shuffleColors}>
                            Shuffle Colors
                        </button>
                        <button className="btn secondary" onClick={sortBoxes}>
                            Sort Boxes
                        </button>
                    </div>
                </aside>

                <section className="boxes-area">
                    <h3 style={{ marginTop: 0 }}>Boxes</h3>
                    <div className="boxes-grid">
                        {boxes.map((box) => (
                            <div
                                key={box.id}
                                className="box-item small-label"
                                style={{
                                    backgroundColor: box.color,
                                    color:
                                        box.color === "yellow" ||
                                        box.color === "pink"
                                            ? "black"
                                            : "white",
                                }}
                            >
                                {box.color}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
