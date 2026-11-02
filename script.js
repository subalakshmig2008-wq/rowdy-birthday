
let currentPage = 1;
let currentSong = null;
let jarOpened = false;
let fireworksInterval = null;
let introFireworksInterval = null;

function playPageSong(pageNumber) {
    const nextSong = document.getElementById("song" + pageNumber);

    if (currentSong === nextSong && nextSong && !nextSong.paused) {
        return;
    }

    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0;
    }

    currentSong = nextSong || null;

    if (currentSong) {
        currentSong.currentTime = 0;
        currentSong.play().catch(() => {});
    }
}

function stopPageSong() {
    if (currentSong) {
        currentSong.pause();
        currentSong.currentTime = 0;
        currentSong = null;
    }
}

function goToPage(pageNumber) {
    const nextPage = document.getElementById("page" + pageNumber);
    if (!nextPage) return;

    // Stop video when leaving Page 9
    const video = document.getElementById("birthdayVideo");
    if (video && pageNumber !== 9) {
        video.pause();
        video.currentTime = 0;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    nextPage.classList.add("active");
    currentPage = pageNumber;

    if (pageNumber === 9) {
        stopPageSong();
        playBirthdayVideo();
    } else {
        playPageSong(pageNumber);
    }

    if (pageNumber === 1) {
        startIntroFireworks();
    } else {
        stopIntroFireworks();
    }

    if (pageNumber === 2) {
        startFireworks();
    } else {
        stopFireworks();
    }
}

function playBirthdayVideo() {
    const video = document.getElementById("birthdayVideo");
    if (!video) return;

    video.currentTime = 0;

    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Browser may require the viewer to press Play
        });
    }
}

/* PAGE 1 FIREWORKS */
function startIntroFireworks() {
    stopIntroFireworks();

    const container = document.getElementById("introFireworks");
    if (!container) return;

    introFireworksInterval = setInterval(() => {
        const rocket = document.createElement("div");
        rocket.className = "rocket";

        const x = 10 + Math.random() * 80;
        rocket.style.left = x + "%";
        container.appendChild(rocket);

        setTimeout(() => {
            const burst = document.createElement("div");
            burst.className = "burst";

            const colors = [
                "#ff62dc", "#ffd166", "#80f7ff",
                "#ffffff", "#b88cff"
            ];

            const color = colors[Math.floor(Math.random() * colors.length)];
            burst.style.color = color;
            burst.style.background = color;
            burst.style.left = x + "%";
            burst.style.top = (15 + Math.random() * 55) + "%";

            container.appendChild(burst);

            setTimeout(() => burst.remove(), 1200);
            rocket.remove();
        }, 900);
    }, 550);
}

function stopIntroFireworks() {
    if (introFireworksInterval) {
        clearInterval(introFireworksInterval);
        introFireworksInterval = null;
    }

    const container = document.getElementById("introFireworks");
    if (container) container.innerHTML = "";
}

/* PAGE 2 FIREWORKS */
function startFireworks() {
    stopFireworks();

    const container = document.getElementById("fireworks");
    if (!container) return;

    fireworksInterval = setInterval(() => {
        const firework = document.createElement("div");
        firework.className = "firework";
        firework.style.left = Math.random() * 95 + "%";
        firework.style.top = Math.random() * 80 + "%";

        container.appendChild(firework);
        setTimeout(() => firework.remove(), 1400);
    }, 350);
}

function stopFireworks() {
    if (fireworksInterval) {
        clearInterval(fireworksInterval);
        fireworksInterval = null;
    }

    const container = document.getElementById("fireworks");
    if (container) container.innerHTML = "";
}

/* PAGE 5 - LETTER */
function revealLetter() {
    document.getElementById("letterMessage").classList.add("show");
}

/* PAGE 6 - SECRET */
function unlockSecret() {
    const password = document.getElementById("secretPassword").value
        .trim().toLowerCase();

    const error = document.getElementById("passwordError");
    const message = document.getElementById("secretMessage");

    if (password === "rowdy") {
        error.textContent = "";
        message.classList.add("show");
    } else {
        error.textContent = "Wrong word! Try again, Rowdy 😉";
    }
}

/* PAGE 7 - JAR */
function openJar() {
    if (!jarOpened) {
        document.getElementById("jarMessage").classList.add("show");
        jarOpened = true;
    }
}

/* RESTART */
function restartWebsite() {
    document.getElementById("letterMessage").classList.remove("show");
    document.getElementById("secretMessage").classList.remove("show");
    document.getElementById("jarMessage").classList.remove("show");

    document.getElementById("secretPassword").value = "";
    document.getElementById("passwordError").textContent = "";

    jarOpened = false;

    const video = document.getElementById("birthdayVideo");
    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    stopPageSong();
    goToPage(1);
}

/* FIRST USER INTERACTION - START PAGE 1 MUSIC */
document.addEventListener("click", function startFirstMusic() {
    if (currentPage !== 9) {
        const song = document.getElementById("song" + currentPage);

        if (song && song.paused) {
            playPageSong(currentPage);
        }
    }
}, { once: true });

document.addEventListener("DOMContentLoaded", () => {
    startIntroFireworks();

    document.getElementById("secretPassword").addEventListener("keydown", event => {
        if (event.key === "Enter") {
            unlockSecret();
        }
    });
});
