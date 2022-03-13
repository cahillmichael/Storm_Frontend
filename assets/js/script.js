var apiKey ="81faa6138422d76a66a3fc36274723e6";
submitBtn = document.querySelector("#submit-btn");
cityName = document.querySelector("#city-name");
displayCurrentBox = document.querySelector("#current-weather");
displayForecastBox = document.querySelector("#week-forecast")
coord = [];


function citySearch(event) {
    event.preventDefault();

    var searchTerm = cityName.value;
    //verified user input
    if(!searchTerm) {
        alert("Please enter a city.");
    } else {
    var cityCurrentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey + "&units=imperial";
    //call api with alert handling non-200 response
    fetch(cityCurrentUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.coord.lat;
                coord.push(lat);

                var lon = data.coord.lon;
                coord.push(lon);

                // //clear display area
                // displayCurrentBox.innerHTML = "";
                // //call to display
                // displayCurrent(data);
//call to save
            })
        } else {
            alert("City not found. Try again.");
        };
        
    })
    };

};

function displayCurrent(search) {
    //display current weather
    var headerEl = document.createElement("h2")
    headerEl.innerHTML = search.name + " (" + moment(search.dt, "X").format("MM/DD/YYYY") + ") <img src='http://openweathermap.org/img/wn/" + search.weather[0].icon + "@2x.png'>";

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + search.main.temp + "°F"

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind: " + search.wind.speed + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + search.main.humidity + "%";

    var uviEl = document.createElement("p");
    uviEl.textContent = "UV Index: "; 

    displayCurrentBox.append(headerEl);
    displayCurrentBox.append(tempEl);
    displayCurrentBox.append(windSpeedEl);
    displayCurrentBox.append(humidityEl);
    displayCurrentBox.append(uviEl);

    displayForecast(coord);
};

function displayForecast(coord) {

    var cityForecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord[0] + "&lon=" + coord[1] + "&appid=" + apiKey + "&units=imperial";

    fetch(cityForecastUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                //from tomorrow (i=1) to five days hence (i=5), append forecast box with data tiles
                for (let i = 1; i <= 5; i++) {
                    displayForecastBox.innerHTML += 
                        `<div class="forecast-tile">
                            <h4>${moment(data.daily[i].dt, "X").format("MM/DD/YYYY")}</h5>
                            <img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
                            <p class="forecast-stat">Temp: ${data.daily[i].temp.day}&#176;F</p>
                            <p class="forecast-stat">Wind: ${data.daily[i].wind_speed} MPH</p>
                            <p class="forecast-stat">Humidity: ${data.daily[i].humidity}%</p>
                        </div>`  
                };
            })

            //add UV index to current forecast
        } else {
            alert("City not found. Try again.");
        };
    });
};


submitBtn.addEventListener("click", citySearch);