//MAKES ARRAY FROM LOCAL STORAGE OR IS BLANK
var searchHistory = JSON.parse(localStorage.getItem('City Name')) || [];
var historyList = $('#city-list')
var forecastEl = $('#5dayforecast')
var forecastTitle = $('#5dayforecast-title')
var weatherEl = $('#current-weather')

var apiKey = "bbe2aa3199841348e66e7179736b0e67"





//FILTERS ARRAY FOR UNIQUE VALUES
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var unique = searchHistory.filter(onlyUnique);


//When Search button is clicked
$("#search-btn").on("click", function () {
  //grabs city name 
  if (!$(this).siblings('input').val()) {
    alert("Please input a city name")
    return
  } else {
    var cityName = $(this).siblings('input').val()
  }

  //Sends fetch to openweather map
  fetchWeatherData(cityName)
});

var fetchWeatherData = function (cityName) {
  console.log(cityName);
  //Sends fetch to openweather map
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          //Current Forecast 
          currentWeather(data)
          //Five day forecast
          FiveDayForecast(data)
        });
        //Saves Seach into Array
        searchHistory.push(cityName)
        //Pushes Array into localstorage 
        saveSearch();
        //adds list item button if city isnt in search history
        var liEl = document.createElement('li');
        var buttonEl = document.createElement('button')
        buttonEl.textContent = cityName;
        cityName = cityName.replace(/\s+/g, '')
        buttonEl.setAttribute('class', 'btn btn-secondary ' + cityName);
        buttonEl.setAttribute('type', 'button');
        //search to see if city is in search history
        if ($('.' + cityName).length) {
          return
        } else {
          liEl.append(buttonEl);
          historyList.append(liEl);

          $(".btn-secondary").on('click', function (event) {
            cityName = ($(this).text())
            fetchWeatherData(cityName)
          })
        }
      } else {
        //If the city input doesnt exist
        alert('Error: City not found');
        document.getElementById("city-name").value = "";
        return
      }
    });
}
//APPENDS ARRAY UNIQUES INTO BUTTONS TO SHOW SEARCH HISTORY
var grabHistory = function () {

  for (var i = unique.length - 1; i >= 0; i--) {
    var liEl = document.createElement('li');
    var buttonEl = document.createElement('button')
    buttonEl.textContent = unique[i];
    buttonEl.setAttribute('class', 'btn btn-secondary ' + unique[i].replace(/\s+/g, ''));
    buttonEl.setAttribute('type', 'button');

    liEl.append(buttonEl);
    historyList.append(liEl);
  }


}

//SAVES SEARCHES INTO LOCAL STORAGE
var saveSearch = function () {
  localStorage.setItem('City Name', JSON.stringify(searchHistory));
}

//DISPLAYS CURRENT WEATHER STATS
var currentWeather = function (weather) {

//Gets Lat and Long of City 
var cityLat = weather.city.coord.lat
var cityLon = weather.city.coord.lon

  //Makes Fetch call to get UVI and adds to weatherEl
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      //clears out WeatherEl Div before adding info
      weatherEl.empty();

      //adds city title 
      var cityTitle = document.createElement('h2')
      cityTitle.textContent = weather.city.name + " (" + moment.unix(weather.list[0].dt).format("MMM D, YYYY") + ') ';

      //adds weather icon
      var forecastImage = document.createElement('img')
      forecastImage.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`)
      cityTitle.append(forecastImage)

      weatherEl.append(cityTitle)

      //Adds temperature
      var forecastTemp = document.createElement('p')
      forecastTemp.textContent = 'Temp: ' + weather.list[0].main.temp + '°F'
      weatherEl.append(forecastTemp)

      //Gets Wind for each day
      var forecastWind = document.createElement('p')
      forecastWind.textContent = 'Wind: ' + weather.list[0].wind.speed + 'MPH';
      weatherEl.append(forecastWind)

      //Gets Humidity for each day
      var forecastHumidity = document.createElement('p')
      forecastHumidity.textContent = 'Humidity: ' + weather.list[0].main.humidity + '%'
      weatherEl.append(forecastHumidity)

      

      var cityUviText = document.createElement('p')
      var cityUvi = document.createElement('span')
      cityUvi = data.current.uvi
      cityUviText.textContent = 'UV Index: '
      cityUviText.append(cityUvi)
      weatherEl.append(cityUviText)

    });


}

//DISPLAY 5 DAY FORECAST 
var FiveDayForecast = function (weather) {
  //clears out forecastEl Div before adding info
  forecastEl.empty();
  document.querySelector('#forecast-title').textContent = "5-Day Forecast:";

  for (i = 5; i < weather.list.length; i = i + 8) {
    var forecastCard = document.createElement('div')
    forecastCard.setAttribute('class', 'card col-md-2 border forecastCard')

    //Gets date for each day
    var forecastDate = document.createElement('h6')
    forecastDate.textContent = moment.unix(weather.list[i].dt).format("MMM D, YYYY");
    forecastCard.append(forecastDate)

    //Gets Image for each day
    var forecastImage = document.createElement('img')
    forecastImage.setAttribute('src', `https://openweathermap.org/img/wn/${weather.list[i].weather[0].icon}@2x.png`)
    forecastCard.append(forecastImage)

    //Gets Temp for each day
    var forecastTemp = document.createElement('p')
    forecastTemp.textContent = 'Temp: ' + weather.list[i].main.temp + '°F'
    forecastCard.append(forecastTemp)

    //Gets Wind for each day
    var forecastWind = document.createElement('p')
    forecastWind.textContent = 'Wind: ' + weather.list[i].wind.speed + 'MPH';
    forecastCard.append(forecastWind)

    //Gets Humidity for each day
    var forecastHumidity = document.createElement('p')
    forecastHumidity.textContent = 'Humidity: ' + weather.list[i].main.humidity + '%'
    forecastCard.append(forecastHumidity)

    //Appends Forecast Card to Forecast Container
    forecastEl.append(forecastCard)
  }



}



grabHistory();

$(".btn-secondary").on('click', function (event) {
  cityName = ($(this).text())
  fetchWeatherData(cityName)
})
