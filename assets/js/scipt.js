var city = "dallas"

var apiKey = "bbe2aa3199841348e66e7179736b0e67"
var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`


fetch(apiURL)
  .then(response => response.json())
  .then(data => console.log(data));