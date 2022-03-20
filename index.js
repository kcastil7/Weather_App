var searchEl = document.querySelector(".city-name");
var formEl = document.querySelector(".weather-form");
var currentWeatherEl = document.querySelector(".current-weather");
var forecastEl = document.querySelector(".forecast");
var forecastContentEl = document.querySelector(".forecast-content");
var historyListEl = document.querySelector(".city-history");
var cityBtn = document.querySelector(".city-button");
var lat;
var long;

populateCityHistory();

//event listener to grab the city name
formEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var cityName = searchEl.value
    setLatLon(cityName);
   
});


function populateCityHistory() {
    historyListEl.textContent = "";
    var cityArr = getHistory();
    for (var i = 0; i < cityArr.length; i++) {
        var btn = document.createElement("button");
        btn.setAttribute('type', 'button')
        btn.setAttribute('class', 'city-button btn btn-secondary')
        btn.setAttribute('style', 'margin-top:10px;')
        btn.setAttribute('id', cityArr[i]);
        btn.textContent = cityArr[i];
        historyListEl.append(btn);

        btn.addEventListener('click',function (e){
            var el = e.target;
            setLatLon(el.getAttribute('id'))
        })
    }

}

function saveHistory(city) {
    var citylist = getHistory();
    if(!citylist.includes(city)){
        citylist.push(city);
    }
    localStorage.setItem('city', JSON.stringify(citylist));
}
function getHistory() {
    if (localStorage.getItem('city') != null) {

        return JSON.parse(localStorage.getItem('city'));
    }
    return [];
}

function setLatLon(name){

    var requestCordURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + name + ',US&limit=5&appid=bedd3daade36ca94fa2798a1852e1cd6'

    fetch(requestCordURL)
        .then(function (resopnse) {
            return resopnse.json();
        })
        .then(function (cordData) {
            lat = cordData[0].lat;
            long = cordData[0].lon;
            cityName = cordData[0].name;

            var requestWeatherForecastURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&appid=bedd3daade36ca94fa2798a1852e1cd6'

            fetch(requestWeatherForecastURL)
                .then(function (response) {
                    return response.json();

                })
                .then(function (weatherData) {
                    saveHistory(cityName);
                    currentWeatherEl.textContent = "";
                    forecastContentEl.textContent = "";
                    forecastEl.textContent = "";

                    var cityEl = document.createElement("h2");
                    cityEl.textContent = cityName + " (" + moment().add(0, "d").format("M/D/YYYY") + ")";
                    var weatherIcon = document.createElement("img");
                    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png");
                    cityEl.append(weatherIcon);
                    var tempEl = document.createElement("p");
                    tempEl.textContent = "Temp: " + Math.round(((weatherData.current.temp - 273.15) * 9 / 5) + 32) + "\u00B0 F";
                    var windEl = document.createElement("p");
                    windEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH";
                    var humidEl = document.createElement("p");
                    humidEl.textContent = "Humidity: " + weatherData.current.humidity + "%";
                    var uvEl = document.createElement("p");
                    uvEl.textContent = "UV Index: " + weatherData.current.uvi;

                    currentWeatherEl.append(cityEl);
                    currentWeatherEl.append(tempEl);
                    currentWeatherEl.append(windEl);
                    currentWeatherEl.append(humidEl);
                    currentWeatherEl.append(uvEl);

                    var forecastTitleEl = document.createElement("h2");
                    forecastTitleEl.textContent = "5-day forecast:";
                    forecastEl.append(forecastTitleEl);

                    for (var i = 1; i <= 5; i++) {
                        var dateEl = document.createElement("h4");
                        dateEl.textContent = "(" + moment().add(i, "d").format("M/D/YYYY") + ")";
                        var forecastTempEl = document.createElement('p');
                        forecastTempEl.textContent = "Temp: " + Math.round(((weatherData.daily[i].temp.max - 273.15) * 9 / 5) + 32) + "\u00B0 F";
                        var wind = document.createElement('p');
                        wind.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
                        var humid = document.createElement('p');
                        humid.textContent = "Humidity: " + weatherData.daily[i].humidity + "%";
                        var img = document.createElement("img");
                        img.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png")

                        var forecastCardEl = document.createElement("div");
                        forecastCardEl.setAttribute("class", "forecast-card");
                        forecastCardEl.append(dateEl);
                        forecastCardEl.append(img);
                        forecastCardEl.append(forecastTempEl);
                        forecastCardEl.append(wind);
                        forecastCardEl.append(humid);

                        forecastContentEl.append(forecastCardEl);

                    }
                    populateCityHistory();
                })
                .catch(function (weatherError) {
                    console.log(weatherError);
                });

        }).catch(function (error) {
            console.log(error);
        })

}