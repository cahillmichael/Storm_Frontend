var apiKey ="81faa6138422d76a66a3fc36274723e6";
submitBtn = document.querySelector("#submit-btn");
cityName = document.querySelector("#city-name");
displayCurrentBox = document.querySelector("#current-weather");
coord = [];


function citySearch(event) {
    event.preventDefault();

    var searchTerm = cityName.value;
    if(!searchTerm) {
        alert("Please enter a city.");
    } else {
    var cityCurrentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + apiKey + "&units=imperial";

    fetch(cityCurrentUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.coord.lat;
                coord.push(lat);

                var lon = data.coord.lon;
                coord.push(lon);
//clear display area
                displayCurrentBox.innerHTML = "";
//call to display
                displayCurrent(data);
//call to save
            })
        } else {
            alert("City not found. Please try again.");
        };
        
    })
    };

};

function displayCurrent(search) {
    console.log(search);
    //display current weather
    var currentIcon = `<img src='http://openweathermap.org/img/wn/${search.weather[0].icon}@2x.png'>`;

    var headerEl = document.createElement("h2")
    headerEl.innerHTML = search.name + " (" + moment(search.dt, "X").format("MM/DD/YYYY") + ") " + currentIcon;

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
};

submitBtn.addEventListener("click", citySearch);