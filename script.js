const inputArea = document.getElementById("input");
const box = document.getElementById("box");

inputArea.addEventListener("input", function () {
  const inputVal = inputArea.value.trim();
  box.style.backgroundColor = inputVal;
});

const apikey = "44af1529af3d36e126326e26a4744d16";
const inputAreaTwo = document.getElementById("cityinput");

inputAreaTwo.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const city = document.getElementById("cityinput").value.trim();
    getWeather(city);
  }
});

function getWeather(city) {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const icon = getWeatherIcon(data.weather[0].main);
      document.getElementById("location").textContent =
        "City name: " + data.name + "," + " " + data.sys.country;
      document.getElementById(
        "Weather-icon"
      ).innerHTML = `<i class="fas ${icon}"></i>`;
      document.getElementById("temp").textContent =
        "Temperature: " + data.main.temp + "°C";
      document.getElementById("humidity").textContent =
        "Humidity: " + data.main.humidity + "%";
      document.getElementById("wind").textContent =
        "Wind: " + data.wind.speed * 3.6 + "km/h";
      document.getElementById("feels-like").textContent =
        "Feels like: " + data.main.feels_like + "°C";
      document.getElementById("weather-description").textContent =
        "Weather description: " + data.weather[0].description;

      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apikey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const dailyForecast = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      console.log(dailyForecast);

      const forecastContainer = document.getElementById("forecast");
      forecastContainer.style.display = "block";
      forecastContainer.innerHTML = "Weather forecast for next 5 days:"; // Reset to initial text


      
      dailyForecast.forEach((day) => {
        const forecastElement = document.createElement("div");
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", {
          weekday: "short",
        });
        // const icon = getWeatherIcon(day.weather[0].main);

        console.log(date);
        console.log(dayName, day.main.temp_max, day.main.temp_min);
        forecastElement.textContent =
          dayName +
          "|" +
          " Max Temp: " +
          day.main.temp_max +
          "|" +
          " Min Temp: " +
          day.main.temp_min;

        document.getElementById("forecast").appendChild(forecastElement);
      });
    }).finally(() => {
      // Hide loading spinner when done (success or failure)
      loadingElement.style.display = "none";
    });
}

function getWeatherIcon(weatherCondition) {
  const weatherMap = {
    Clear: "fa-sun",
    Clouds: "fa-cloud",
    Rain: "fa-cloud-rain",
    Drizzle: "fa-cloud-rain",
    Thunderstorm: "fa-bolt",
    Snow: "fa-snowflake",
    Mist: "fa-smog",
    Smoke: "fa-smog",
    Haze: "fa-smog",
    Dust: "fa-smog",
    Fog: "fa-smog",
    Sand: "fa-smog",
    Ash: "fa-smog",
    Squall: "fa-wind",
    Tornado: "fa-tornado",
  };

  return weatherMap[weatherCondition] || "fa-cloud";
}
