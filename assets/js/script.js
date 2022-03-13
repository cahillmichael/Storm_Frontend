var apiKey ="81faa6138422d76a66a3fc36274723e6";
submitBtn = document.querySelector("#submit-btn");
cityName = document.querySelector("#city-name");
displayCurrentBox = document.querySelector("#current-weather");
displayForecastBox = document.querySelector("#week-forecast")
var city;
coord = [];


function citySearch(event) {
    event.preventDefault();
    coord=[];
    var searchTerm = cityName.value;
    if(!searchTerm) {
        alert("Please enter a city.");
    } else {
    var citySearchUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey + "&units=imperial";
    fetch(citySearchUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {


                var lat = data.coord.lat;
                coord.push(lat);

                var lon = data.coord.lon;
                coord.push(lon);

                city = data.name;
                coordSearch(coord);
            })
        } else {
            alert("City not found. Try again.");
        };
        });
    };
};

function coordSearch(coord) {
    var coordSearchUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coord[0] + "&lon=" + coord[1] + "&appid=" + apiKey + "&exclude=minutely,hourly&units=imperial";
    fetch(coordSearchUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayCurrent(data);
//console!!!!                
                console.log(data);
                console.log(coord);
            })
        } else {
            alert("City not found. Try again.");
        };
    });
};

function displayCurrent(data) {
    displayCurrentBox.innerHTML="";
    //display current weather
    var headerEl = document.createElement("h2")
    headerEl.innerHTML = city + " (" + moment(data.current.dt, "X").format("MM/DD/YYYY") + ") <img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'>";

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + data.current.temp + "°F"

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind: " + data.current.wind_speed + " MPH";

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + data.current.humidity + "%";

    var uviEl = document.createElement("p");
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

    // displayForecast(coord);
};

// function displayForecast(coord) {

    

//                 //from tomorrow (i=1) to five days hence (i=5), append forecast box with data tiles
//                 for (let i = 1; i <= 5; i++) {
//                     displayForecastBox.innerHTML += 
//                         `<div class="forecast-tile">
//                             <h4>${moment(data.daily[i].dt, "X").format("MM/DD/YYYY")}</h5>
//                             <img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>
//                             <p class="forecast-stat">Temp: ${data.daily[i].temp.day}&#176;F</p>
//                             <p class="forecast-stat">Wind: ${data.daily[i].wind_speed} MPH</p>
//                             <p class="forecast-stat">Humidity: ${data.daily[i].humidity}%</p>
//                         </div>`  
//                 };
            

//             //add UV index to current forecast
//         } else {
//             alert("City not found. Try again.");
//         };
//     });
// };


submitBtn.addEventListener("click", citySearch);