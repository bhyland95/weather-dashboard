//MAKES ARRAY FROM LOCAL STORAGE OR IS BLANK
var searchHistory = JSON.parse(localStorage.getItem('City Name')) || [];
var historyList = $('#city-list')

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

    //Sends fetch to openweather map
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data)
          });
          //Saves Seach into Array
          searchHistory.push(cityName)
          //Pushes Array into localstorage 
          saveSearch();
        } else {
          //If the city input doesnt exist
          alert('Error: City not found');
        }
      });
  }
});

//APPENDS ARRAY UNIQUES INTO BUTTONS TO SHOW SEARCH HISTORY
var grabHistory = function () {

  for (var i = 0; i < unique.length; i++) {
    var liEl = document.createElement('li');
    var buttonEl = document.createElement('button')
    buttonEl.setAttribute('class', 'btn btn-secondary');
    buttonEl.textContent = unique[i];
    liEl.append(buttonEl);
    historyList.append(liEl);
  }
}

//SAVES SEARCHES INTO LOCAL STORAGE
var saveSearch = function () {
  localStorage.setItem('City Name', JSON.stringify(searchHistory));
}

grabHistory()