
// Declare variable to store the city searched for
var city = "";
// Variable declarations
var searchCity = $('#city');
var searchButton = $('#search-button');
var clearButton = $('#clear');
var currentCity = $('#current-city');
var currentTemperature = $('#temperature');
var currentHumidity = $('#humidity')
var currentWindSpeed = $('#wind-speed');
var currentUvIndex = $('#uv-index');
var sCity = [];

function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.thUpperCase()===sCity[i]){
            return -1;
        }
    } return 1;
}
// Set up the API key 
var APIkey = "dd43e37cd21f9fd712a18ec478657f8b"

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city = searchCity.val().trim();
        currentWeather(city)
    }
};

function currentWeather(city){
    //here I built the ULR so i can get the data from the server
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then(function(response){

        // Parse the response to displat the current weather including the City name, the date, and the weather icons.
        console.log(response);
        
        var iconcode = response.list[0].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        // $('#wicon').attr('src', iconurl);

        var date = new Date(response.dt*1000).toLocaleDateString();

        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");


        var tempF = (response.list[0].main.temp -273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");

        //$(currenthummidty).html(response.list[0].main.humidity+"%");

        var ws = response.wind.speed;
        var windSMPH = (ws*2.237).toFixed(1);
        $(currentWSpeed).html(windSMPH+"MPH");

        currentUvIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==null){
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null) {
                sCity=[];
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            } else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                };
            };
        };
    });
};

// This function returns the UVIindex response.
function UVIndex(ln,lt){
    //lets build the url for uvindex.
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                //$(currentUvindex).html(response.value);
            });
};
    
// Here we display the 5 days forecast for the current city.
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        };
        
    });
};

//Daynamically add the passed city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }
}

// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityName"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityName"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityName");
    document.location.reload();
}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);