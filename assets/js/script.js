var apiKey ="81faa6138422d76a66a3fc36274723e6";
var submitBtn = document.querySelector("#submit-btn");
var cityName = document.querySelector("#city-name");
var displayCurrentBox = document.querySelector("#current-weather");
var displayForecastBox = document.querySelector("#week-forecast");
var searchHistoryBox = document.querySelector("#history-block");
var apiCity;
var cityLocal;
var searchHistory = [];
var coord = [];

//function to call api with city name and return coordinates
function citySearch(cityLocal) {
    //clear coordinate array
    coord=[];
    //handle empty fields
    if(!cityLocal) {
        alert("Please enter a city.");
    } else {
    //set url and call api
    var citySearchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityLocal + "&appid=" + apiKey + "&units=imperial";
    fetch(citySearchUrl).then(function(response) {
        //if a good response, record coordinates
        if (response.ok) {
            response.json().then(function(data) {


                var lat = data.coord.lat;
                coord.push(lat);

                var lon = data.coord.lon;
                coord.push(lon);
                
                //record the name of the city returned by api for display, mitigates typos
                apiCity = data.name;
                coordSearch(coord);
                //clear input field
                cityName.value="";
            })
        } else {
            //handle bad response, clear input
            alert("City not found. Try again.");
            cityName.value="";
        };
        });
    };
};

//call the api again, passing coordinates to get weather data
function coordSearch(coord) {
    var coordSearchUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord[0] + "&lon=" + coord[1] + "&appid=" + apiKey + "&exclude=minutely,hourly&units=imperial";
    fetch(coordSearchUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrent(data);
                saveSearch();
            })
        } else {
            alert("City not found. Try again.");
        };
    });
};

//display current weather
function displayCurrent(data) {
    displayCurrentBox.innerHTML="";
    displayForecastBox.innerHTML="";

    var headerEl = document.createElement("h2")
    headerEl.innerHTML = apiCity + " (" + moment(data.current.dt, "X").format("MM/DD/YYYY") + ") <img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'>";

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + "°F"

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";

    var uviEl = document.createElement("p");
    //conditional classes created to display UV Index as a color
    if (data.current.uvi < 3) {
        uviEl.innerHTML = "UV Index: <span class='uvi-favorable'>" + data.current.uvi + "</span>";
    } else if (data.current.uvi >= 3 && data.current.uvi < 5){
        uviEl.innerHTML = "UV Index: <span class='uvi-moderate'>" + data.current.uvi + "</span>"
    } else if (data.current.uvi >= 5) {
        uviEl.innerHTML = "UV Index: <span class='uvi-severe'>" + data.current.uvi + "</span>"
    }

    displayCurrentBox.append(headerEl);
    displayCurrentBox.append(tempEl);
    displayCurrentBox.append(windSpeedEl);
    displayCurrentBox.append(humidityEl);
    displayCurrentBox.append(uviEl);

    displayForecast(data);
};

//display 5 day forcast
function displayForecast(data) {
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
};

//save search
function saveSearch() {
    //verified search term is not already in history, then create a new button
    if(!searchHistory.includes(apiCity)) {
        searchHistory.push(apiCity);
        localStorage.setItem("searches", JSON.stringify(searchHistory));

        var prevSearchBtn = document.createElement("button");
        prevSearchBtn.className = "history-btn";
        prevSearchBtn.innerText = apiCity;
        //attributes added to initiate search and pass city name on click
        prevSearchBtn.setAttribute("onclick", "historyClick()");
        prevSearchBtn.setAttribute("search-for", apiCity);

        searchHistoryBox.appendChild(prevSearchBtn);
    };
};

//retrieve cites from local storage
function loadHistory() {
    //retrieve data from local storage
    var pastSearches = localStorage.getItem("searches");
    //if data is extant, populate the variable with an array
    if(pastSearches) {
        searchHistory = JSON.parse(pastSearches);

        //iterate through the array of past searches and generate a button for each
        for (var i=0; i < searchHistory.length; i++) {
            var prevSearchBtn = document.createElement("button");
            prevSearchBtn.className = "history-btn";
            prevSearchBtn.innerText = searchHistory[i];
            prevSearchBtn.setAttribute("onclick", "historyClick()");
            prevSearchBtn.setAttribute("search-for", searchHistory[i]);

        searchHistoryBox.appendChild(prevSearchBtn);
        };
    } else {
        //if there is no data in local storage, do nothing
        return false;
    };
};

//function to pull city name from button attribute and call citySearch
function historyClick(searchCity) {
    cityLocal = event.target.getAttribute("search-for")
    citySearch(cityLocal);
};

//function to handle click event and pass city name to city Search
function submitClick(event) {
    event.preventDefault();

    cityLocal = cityName.value;
    citySearch(cityLocal);
};

//load history on page load
loadHistory();

submitBtn.addEventListener("click", submitClick);