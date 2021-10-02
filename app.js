const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

// Store API data in Object
const weather = { temperature: { unit: "celsius" } };

// API KEY
const key = "c01eb55c60aaacfe83149a148327c8da";

// CHECK IF BROWSER SUPPORTS GEOLOCATION

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(positionError) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${positionError.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      console.log(data);
      weather.temperature.value = Math.floor(data.main.temp - 273);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

// DISPLAY WEATHER TO UI
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// Celsius to Fahrenhite conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET{convert celsius to Fahrenhite & vice-versa}

tempElement.addEventListener("click", function () {
  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
searchButton.addEventListener("click", function () {
  getWeatherCity(searchInput.value);
  searchInput.value = " ";
});

//Search by city

const cityWeather = { temperature: { unit: "celsius" } };

function getWeatherCity(city) {
  const cityApi = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;

  fetch(cityApi)
    .then(function (response) {
      let data = response.json();
      return data;
    })

    .then(function (data) {
      if (data.message) {
        alert("No City With This Name ");
        return;
      }

      console.log(data);

      cityWeather.temperature.value = Math.floor(data.main.temp - 273);
      cityWeather.description = data.weather[0].description;
      cityWeather.iconId = data.weather[0].icon;
      cityWeather.city = data.name;
      cityWeather.country = data.sys.country;

      displayWeatherByCity();

      tempElement.addEventListener("click", function () {
        if (cityWeather.temperature.unit == "celsius") {
          let fahrenheit = celsiusToFahrenheit(cityWeather.temperature.value);
          fahrenheit = Math.floor(fahrenheit);

          tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
          cityWeather.temperature.unit = "fahrenheit";
        } else {
          tempElement.innerHTML = `${cityWeather.temperature.value}°<span>C</span>`;
          cityWeather.temperature.unit = "celsius";
        }
      });
      function displayWeatherByCity() {
        iconElement.innerHTML = `<img src="icons/${cityWeather.iconId}.png"/>`;
        tempElement.innerHTML = `${cityWeather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = cityWeather.description;
        locationElement.innerHTML = `${cityWeather.city}, ${cityWeather.country}`;
      }
    });
}

searchInput.addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    getWeatherCity(searchInput.value);
    searchInput.value = " ";
  }
});
