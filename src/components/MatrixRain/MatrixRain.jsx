import { useEffect } from "react";
import { MatrixRainCanvas } from "./MatrixRainStyled";

export const MatrixRain = ({
    content = "ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ",
}) => {
    useEffect(() => {
        // Initialising the canvas
        const canvas = document.querySelector("#matrix"),
            ctx = canvas.getContext("2d");

        // Setting up the letters
        // replace white space with empty string
        const letters = content.replace(/\s/g, "").toUpperCase().split("");
        console.log(letters);

        // Setting up the columns
        const fontSize = 10,
            columns = window.innerWidth / fontSize;

        // Setting up the drops
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // Setting up the draw function
        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, .1)";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillStyle = "#0f0";
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                drops[i]++;
                if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.95) {
                    drops[i] = 0;
                }
            }
        }

        // Loop the animation
        setInterval(draw, 48);
    }, []);
    return <MatrixRainCanvas id="matrix" />;
};
