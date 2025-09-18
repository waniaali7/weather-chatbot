const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');

const API_KEY = "0ffd60ea163fb1e1b0d22a76827070f7";

function getTime() {
  const now = new Date();
  return now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
}

function appendMessage(message, className) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', className);
  msgDiv.innerHTML = `${message}<div class="time">${getTime()}</div>`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const city = userInput.value.trim();
  if (!city) return;

  appendMessage(city, 'user-message');
  userInput.value = "";
  getWeather(city);
}

async function getWeather(city) {
  appendMessage("Fetching weather...", 'bot-message');
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();

    if (data.cod === 200) {
      const weather = data.weather[0].main.toLowerCase();

      // Dynamic background
      if(weather.includes("cloud")) document.body.style.background = "linear-gradient(to bottom, #d7d2cc, #304352)";
      else if(weather.includes("rain")) document.body.style.background = "linear-gradient(to bottom, #4e54c8, #8f94fb)";
      else if(weather.includes("clear")) document.body.style.background = "linear-gradient(to bottom, #fbc2eb, #a6c1ee)";
      else document.body.style.background = "linear-gradient(to bottom, #a1c4fd, #c2e9fb)";

      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      const message = `<img src="${iconUrl}" class="weather-icon"/> 
      Weather in <b>${data.name}</b>:<br>
      Temperature: ${data.main.temp}°C<br>
      Description: ${data.weather[0].description}<br>
      Humidity: ${data.main.humidity}%<br>
      Wind Speed: ${data.wind.speed} m/s`;

      appendMessage(message, 'bot-message');
    } else {
      appendMessage("❌ City not found. Please try again.", 'bot-message');
    }
  } catch (err) {
    appendMessage("⚠️ Error fetching weather. Try again later.", 'bot-message');
  }
}
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});