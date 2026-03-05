let temp2 = document.querySelector("#temp");
let place = document.querySelector("#place");
let des2 = document.querySelector("#des");
let time = document.querySelector("#time");
let date = document.querySelector("#date");
let input = document.querySelector("#searchInput");
let btn = document.querySelector("#searchBtn");

let APIkey = "86180d24cb67a3da2534b59a450d6b10";
/*날씨 */
getLocation();
function getLocation() {
  navigator.geolocation.getCurrentPosition(success);
}
async function success(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  console.log(lat, long);
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIkey}&units=metric&lang=en`,
  );
  let data = await response.json();
  loadForecastByCoord(lat, long);
  renderWeather(data);
}

weather = async (cityname) => {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}&units=metric&lang=en`,
  );
  let data = await response.json();
  console.log(data);
  loadForecastByCity(cityname);
  renderWeather(data);
};
/*날짜 */
async function loadForecastByCoord(lat, lon) {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=en`,
  );
  let data = await res.json();
  renderForecastChart(data);
}
async function loadForecastByCity(city) {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric&lang=en`,
  );
  let data = await res.json();
  renderForecastChart(data);
}
function getFormattedDate() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
/*시간 */
renderWeather = (data) => {
  // const iconCode = "09d";
  const iconCode = data.weather[0].icon;
  BackgroundByIcon(iconCode);
  StoneByIcon(iconCode);
  StoneEffectByIcon(iconCode);
  let start = () => {
    let day = new Date();
    let hours = day.getHours();
    let minutes = day.getMinutes();
    let seconds = day.getSeconds();

    if (hours < 12) {
      hrs = "AM";
    } else if (hours > 12) {
      hrs = "PM";
      hours = hours - 12;
    } else {
      hrs = "PM";
      hours = hours;
    }
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    minutes = minutes > 9 ? minutes : `0${minutes}`;
    time.innerHTML = `<p>${hrs} ${hours} : ${minutes} : ${seconds}</p>`;
  };

  temp2.textContent = Math.round(data.main.temp) + `℃`;
  place.textContent = data.name;
  des2.textContent = data.weather[0].description;
  place.textContent = data.name;
  time.textContent = setInterval(start, 1000);
  date.textContent = getFormattedDate();
};
/*배경 동영상 */
function BackgroundByIcon(iconCode) {
  const videoElement = document.querySelector("#bgVideo");
  const videoSource = videoElement.querySelector("source");
  let videoUrl = "";

  switch (iconCode) {
    case "01d":
    case "01n":
      videoUrl = "img/sun.mp4";
      break;

    case "02d":
    case "02n":
      videoUrl = "img/few.mp4";
      break;

    case "03d":
    case "03n":
      videoUrl = "img/cl.mp4";
      break;

    case "04d":
    case "04n":
      videoUrl = "img/cloud.mp4";

      break;

    case "09d":
    case "09n":
      videoUrl = "img/shower.mp4";

      break;

    case "10d":
    case "10n":
      videoUrl = "img/rain.mp4";
      break;

    case "11d":
    case "11n":
      videoUrl = "img/th.mp4";
      break;

    case "13d":
    case "13n":
      videoUrl = "img/snow.mp4";
      break;

    case "50d":
    case "50n":
      videoUrl = "img/fog.mp4";
      break;

    default:
      videoUrl = "img/sun.mp4";
      break;
  }

  if (videoSource.src !== videoUrl) {
    videoSource.src = videoUrl;
    videoElement.load();
  }
}
/*차트 */
let chart;

function renderForecastChart(data) {
  let temps = [];
  let labels = [];

  for (let i = 0; i < 8; i++) {
    let temp = Math.round(data.list[i].main.temp);
    let label = data.list[i].dt_txt.slice(11, 16);

    temps.push(temp);
    labels.push(label);
  }

  drawChart(labels, temps);
}

function drawChart(labels, temps) {
  let ctx = document.querySelector("#weatherChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: temps,
          borderColor: "orange",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "orange",
          tension: 0.3,
          fill: false,
          clip: false,
        },
      ],
    },
    plugins: [ChartDataLabels],
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 30,
          right: 30,
        },
      },
      plugins: {
        legend: { display: false },

        datalabels: {
          align: "top",
          anchor: "end",
          offset: -5,
          color: "#fff",
          font: {
            size: "13vw",
            weight: "bold",
          },
          formatter: (value, ctx) => {
            let time = ctx.chart.data.labels[ctx.dataIndex];
            return `${value}℃\n${time}`;
          },
        },
      },

      responsive: true,
      maintainAspectRatio: false,

      scales: {
        x: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },

        y: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },
      },
    },
  });
}
/*돌 */
function StoneByIcon(iconCode) {
  const stoneImg = document.querySelector(".smallBox2 img");
  let stoneUrl = "";

  switch (iconCode) {
    case "01d":
    case "01n":
      stoneUrl = "img/sun.gif";
      break;

    case "02d":
    case "02n":
      stoneUrl = "img/sun.gif";
      break;

    case "03d":
    case "03n":
      stoneUrl = "img/sun.gif";
      break;

    case "04d":
    case "04n":
      stoneUrl = "img/sun.gif";
      break;

    case "09d":
    case "09n":
      stoneUrl = "img/rain.gif";
      break;

    case "10d":
    case "10n":
      stoneUrl = "img/rain.gif";
      break;

    case "11d":
    case "11n":
      stoneUrl = "img/hc.png";
      break;

    case "13d":
    case "13n":
      stoneUrl = "img/snow.gif";
      break;

    case "50d":
    case "50n":
      stoneUrl = "img/sun.gif";
      break;

    default:
      stoneUrl = "img/sun.gif";
      break;
  }

  stoneImg.src = stoneUrl;
}
let stoneAnimId;

function clearStoneCanvas() {
  const canvas = document.getElementById("stoneEffect");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function startStoneRain() {
  const canvas = document.getElementById("stoneEffect");
  const ctx = canvas.getContext("2d");
  const box = document.querySelector(".smallBox2");

  function resize() {
    canvas.width = box.clientWidth;
    canvas.height = box.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const drops = [];
  const dropCount = 200;

  for (let i = 0; i < dropCount; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 5 + 5,
      wind: Math.random() * 2 - 1,
    });
  }

  function rain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(180, 180, 255, 0.7)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    drops.forEach((d) => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.wind, d.y + d.length);
      ctx.stroke();

      d.y += d.speed;
      d.x += d.wind * 0.5;

      if (d.y > canvas.height) {
        d.y = -20;
        d.x = Math.random() * canvas.width;
      }
    });

    stoneAnimId = requestAnimationFrame(rain);
  }

  rain();
}
function startStoneSnow() {
  const canvas = document.getElementById("stoneEffect");
  const ctx = canvas.getContext("2d");
  const box = document.querySelector(".smallBox2");

  function resize() {
    canvas.width = box.clientWidth;
    canvas.height = box.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const flakes = [];
  for (let i = 0; i < 200; i++) {
    flakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
    });
  }

  function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    flakes.forEach((f) => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();

      f.y += f.speed;
      if (f.y > canvas.height) f.y = -10;
    });

    stoneAnimId = requestAnimationFrame(snow);
  }

  snow();
}
function startStoneThunder() {
  const flash = document.getElementById("stoneFlash");

  function lightning() {
    const delay = Math.random() * 3000 + 2000;

    setTimeout(() => {
      const intensity = Math.random() * 0.6 + 0.4;

      flash.style.opacity = intensity;

      setTimeout(() => {
        flash.style.opacity = 0;
      }, 100);

      if (Math.random() > 0.6) {
        setTimeout(() => (flash.style.opacity = intensity * 0.7), 150);
        setTimeout(() => (flash.style.opacity = 0), 250);
      }

      lightning();
    }, delay);
  }

  lightning();
}
function StoneEffectByIcon(iconCode) {
  cancelAnimationFrame(stoneAnimId);
  clearStoneCanvas();

  switch (iconCode) {
    case "01d":
    case "01n":
      startStoneClear();
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      startStoneRain();
      break;

    case "13d":
    case "13n":
      startStoneSnow();
      break;

    case "50d":
    case "50n":
      startStoneFog();
      break;

    case "11d":
    case "11n":
      startStoneRain();
      startStoneThunder();
      break;

    default:
      clearStoneCanvas();
      break;
  }
}
let fogArr = [];
let fogAnimId;

function startStoneFog() {
  const container = document.getElementById("stoneFog");
  container.innerHTML = "";
  fogArr = [];

  const box = document.querySelector(".smallBox2");

  const W = box.clientWidth;
  const H = box.clientHeight;

  class Fog {
    constructor(x, y, size, direction, velocity) {
      this.x = x;
      this.y = y;
      this.w = size.w;
      this.h = size.h;
      this.direction = direction;
      this.velocity = velocity;

      this.el = document.createElement("div");
      this.el.classList.add("fog");
      this.el.style.width = this.w + "px";
      this.el.style.height = this.h + "px";
      container.appendChild(this.el);
    }

    move() {
      this.el.style.left = this.x + "px";
      this.el.style.top = this.y + "px";

      if (this.direction === 0) {
        this.x -= this.velocity;
        if (this.x + this.w < 0) {
          this.x = W + this.w;
        }
      } else {
        this.x += this.velocity;
        if (this.x > W) {
          this.x = -this.w;
        }
      }
    }
  }

  // Fog 생성
  fogArr = [
    new Fog(W * 0.2, H * 0.3, { w: W * 0.35, h: H * 0.35 }, 0, 0.4),
    new Fog(W * 0.6, H * 0.2, { w: W * 0.25, h: H * 0.25 }, 0, 0.45),
    new Fog(W * 0.1, H * 0.6, { w: W * 0.45, h: H * 0.4 }, 0, 0.5),
    new Fog(W * 0.7, H * 0.5, { w: W * 0.15, h: H * 0.2 }, 0, 0.35),
    new Fog(W * 0.35, H * 0.7, { w: W * 0.3, h: H * 0.3 }, 0, 0.4),
  ];

  function animateFog() {
    fogArr.forEach((f) => f.move());
    fogAnimId = requestAnimationFrame(animateFog);
  }

  animateFog();
}

function stopStoneFog() {
  cancelAnimationFrame(fogAnimId);
  const container = document.getElementById("stoneFog");
  if (container) container.innerHTML = "";
}
function startStoneClear() {
  const canvas = document.getElementById("stoneEffect");
  const ctx = canvas.getContext("2d");
  const box = document.querySelector(".smallBox2");

  function resize() {
    canvas.width = box.clientWidth;
    canvas.height = box.clientHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let beams = [
    {
      alpha: 0,
      maxAlpha: 0.35,
      speed: 0.00025,
      x1: -50,
      y1: -50,
      x2: 200,
      y2: 200,
    },
    {
      alpha: 0,
      maxAlpha: 0.28,
      speed: 0.0002,
      x1: 0,
      y1: -80,
      x2: 240,
      y2: 160,
    },
    {
      alpha: 0,
      maxAlpha: 0.22,
      speed: 0.00015,
      x1: -30,
      y1: 20,
      x2: 260,
      y2: 260,
    },
  ];

  function clearSky() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    beams.forEach((b) => {
      b.alpha += b.speed;
      if (b.alpha >= b.maxAlpha || b.alpha <= 0) {
        b.speed *= -1;
      }

      let g = ctx.createLinearGradient(b.x1, b.y1, b.x2, b.y2);

      g.addColorStop(0, `rgba(255,255,220,${b.alpha})`);
      g.addColorStop(0.5, `rgba(255,255,255,${b.alpha * 0.3})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);

      ctx.fillStyle = g;
      ctx.globalCompositeOperation = "lighter";

      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    ctx.globalCompositeOperation = "source-over";
    stoneAnimId = requestAnimationFrame(clearSky);
  }

  clearSky();
}
/*검색 */

btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city === "") return;
  weather(city);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = input.value.trim();
    if (city === "") return;
    weather(city);
    input.value = "";
  }
});
