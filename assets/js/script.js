var apiKey ="81faa6138422d76a66a3fc36274723e6";
submitBtn = document.querySelector("#submit-btn");
cityName = document.querySelector("#city-name");
coord = [];


function citySearch(event) {
    event.preventDefault();

    var city = cityName.value;
    if(!city) {
        alert("Please enter a city.");
    } else {
    var cityCurrentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(cityCurrentUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.coord.lat;
                coord.push(lat);

                var lon = data.coord.lon;
                coord.push(lon);
//call to display
//call to save
            })
        } else {
            alert("City not found. Please try again.");
        };
        
    })
    };
};


submitBtn.addEventListener("click", citySearch);