const cityInput = document.querySelector("#city")
const timeInput = document.querySelector("#time")
const cityDisplay = document.querySelector("#cityName")
const temp = document.querySelector("#temp")
const desc = document.querySelector("#weather-desc")
const icon = document.querySelector("#weather-icon")
const clouds = document.querySelector("#clouds")
const humidity = document.querySelector("#humi")
const pressure = document.querySelector("#pressure")
const wind = document.querySelector("#wind")
const windDir = document.querySelector("#windDir")
const rain = document.querySelector("#rain")
const snow = document.querySelector("#snow")
const error = document.querySelector("#error")
const customTime = document.querySelector("#customTime")
const customTimeCont = document.querySelector("#custom")

const viewCustom = () =>{
    if(timeInput.value == "Custom"){
        customTimeCont.style.height = "8vh";
        customTimeCont.style.opacity = 1;
    } 
    else{
        customTimeCont.style.height = 0;
        customTimeCont.style.opacity = 0;
    }
}
const viewWeather = () =>{
    error.style.visibility = "hidden"
    if(cityInput.value == "none" || timeInput.value == "none"){
        error.textContent = "Wprowadź dane!";
        error.style.visibility = "visible";
        return;
    }
    let long = 0.0
    let lat = 0.0
    switch(cityInput.value){
        case "Warszawa":
            lat = 51.13
            long = 21.00
            break;
        case "Kraków":
            lat = 50.03
            long = 19.56
            break;
        case "Olkusz":
            lat = 50.16
            long = 19.33
            break;
        case "Chrzanów":
            lat = 50.08
            long = 19.24
            break;
        case "Drobin":
            lat = 52.44
            long = 19.59
            break;
        default:
            return;
    }
    
    if(timeInput.value == "Teraz"){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${long.toFixed(2)}&current=temperature_2m,relative_humidity_2m,rain,snowfall,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m`)
        .then(res => res.json())
        .then(data => writeViewNow(data));
    }
    else if(timeInput.value == "Custom"){
        if(customTime.value == ""){
            error.textContent = "Wprowadź dane!";
            error.style.visibility = "visible";
            return;
        }
        else if(customTime.value > 100 || customTime.value < 1){
            error.textContent = "Wprowadź poprawny własny czas!";
            error.style.visibility = "visible";
            return;
        }
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${long.toFixed(2)}&current=temperature_2m,relative_humidity_2m,rain,snowfall,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m`)
        .then(res => res.json())
        .then(data => writeViewLater(data, parseInt(customTime.value) -1));
    }
    else {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${long.toFixed(2)}&current=temperature_2m,relative_humidity_2m,rain,snowfall,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m`)
        .then(res => res.json())
        .then(data => writeViewLater(data));
    }
}
const writeViewNow = (data) =>{
    cityDisplay.textContent = `${cityInput.value} - Teraz`
    temp.innerHTML = `<i class="wi wi-thermometer"></i>  Temperatura: ${data.current.temperature_2m}°C`;
    clouds.innerHTML = `<i class="wi wi-cloudy"></i>  Zachmurzenie: ${data.current.cloud_cover}%`
    rain.innerHTML = `<i class="wi wi-sprinkle"></i>  Ilość deszczu ${data.current.rain}mm`
    snow.innerHTML = `<i class="wi wi-snow"></i>  Ilość śniegu: ${data.current.snowfall}cm`
    humidity.innerHTML = `<i class="wi wi-raindrops"></i>  Wilgotność: ${data.current.relative_humidity_2m}%`
    wind.innerHTML = `<i class="wi wi-strong-wind"></i>  Prędkośc wiatru: ${data.current.wind_speed_10m} km/h`
    pressure.innerHTML = `<i class="wi wi-barometer"></i> Ciśnienie: ${data.current.surface_pressure} hPa`
    let direction = "";
    let dirValue = data.current.wind_direction_10m;
    if(dirValue >= 350 || dirValue <= 10){
        direction = "Północ"
    }
    else if(dirValue > 10 && dirValue < 80){
        direction = "Północny-Wschód"
    }
    else if(dirValue >= 80 && dirValue <= 100){
        direction = "Wschód"
    }
    else if(dirValue > 100 && dirValue < 170){
        direction = "Południowy-Wschód"
    }
    else if(dirValue >= 170 && dirValue <= 190 ){
        direction = "Południe"
    }
    else if(dirValue > 190 && dirValue < 260){
        direction = "Południowy-Zachód"
    }
    else if(dirValue >= 260 && dirValue <= 280){
        direction = "Zachód"
    }
    else {
        direction = "Północny-Zachód"
    }
    windDir.innerHTML = `<i class="wi wi-wind-direction"></i>  Kierunek wiatru: ${direction}`
    icon.classList.remove("wi-cloud");
    icon.classList.remove("wi-day-sleet")
    icon.classList.remove("wi-day-rain")
    icon.classList.remove("wi-day-snow-wind")
    icon.classList.remove("wi-cloudy")
    icon.classList.remove("wi-day-cloudy")
    icon.classList.remove("wi-day-sunny")
    if(data.current.rain > 0 && data.current.snowfall > 0){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Opady śniegu z deszczem`;
        icon.classList.add("wi-day-sleet")
        return;
    }
    else if(data.current.rain > 0){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Opady deszczu`
        icon.classList.add("wi-day-rain")
    }
    else if(data.current.snowfall > 0){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Opady śniegu`
        icon.classList.add("wi-day-snow-wind")
    }
    else if(data.current.cloud_cover >= 80){
        desc.innerHTML = `<i class="wi wi-cloud"></i>   Mocno Pochmurnie`
        icon.classList.add("wi-cloudy")
    }
    else if(data.current.cloud_cover >= 40){
        desc.innerHTML = `<i class="wi wi-cloud"></i>   Pochmurnie`
        icon.classList.add("wi-day-cloudy")
    }
    else {
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Słonecznie`
        icon.classList.add("wi-day-sunny")
    }
}
const writeViewLater = (data, h = timeInput.value - 1) =>{
    cityDisplay.textContent = `${cityInput.value} - Za ${h + 1}h`
    temp.innerHTML = `<i class="wi wi-thermometer"></i>  Temperatura: ${data.hourly.temperature_2m[h]}°C`;
    clouds.innerHTML = `<i class="wi wi-cloudy"></i>  Zachmurzenie: ${data.hourly.cloud_cover[h]}%`
    rain.innerHTML = `<i class="wi wi-sprinkle"></i>  Ilość deszczu ${data.hourly.rain[h]}mm`
    snow.innerHTML = `<i class="wi wi-snow"></i>  Ilość śniegu: ${data.hourly.snowfall[h]}cm`
    humidity.innerHTML = `<i class="wi wi-raindrops"></i>  Wilgotność: ${data.hourly.relative_humidity_2m[h]}%`
    wind.innerHTML = `<i class="wi wi-strong-wind"></i>  Prędkośc wiatru: ${data.hourly.wind_speed_10m[h]} km/h`
    pressure.innerHTML = `<i class="wi wi-barometer"></i> Ciśnienie: ${data.hourly.surface_pressure[h]} hPa`
    let direction = "";
    let dirValue = data.hourly.wind_direction_10m[h];
    if(dirValue >= 350 || dirValue <= 10){
        direction = "Północ"
    }
    else if(dirValue > 10 && dirValue < 80){
        direction = "Północny-Wschód"
    }
    else if(dirValue >= 80 && dirValue <= 100){
        direction = "Wschód"
    }
    else if(dirValue > 100 && dirValue < 170){
        direction = "Południowy-Wschód"
    }
    else if(dirValue >= 170 && dirValue <= 190 ){
        direction = "Południe"
    }
    else if(dirValue > 190 && dirValue < 260){
        direction = "Południowy-Zachód"
    }
    else if(dirValue >= 260 && dirValue <= 280){
        direction = "Zachód"
    }
    else {
        direction = "Północny-Zachód"
    }
    windDir.innerHTML = `<i class="wi wi-wind-direction"></i>  Kierunek wiatru: ${direction}`
    icon.classList.remove("wi-cloud");
    icon.classList.remove("wi-day-sleet")
    icon.classList.remove("wi-day-rain")
    icon.classList.remove("wi-day-snow-wind")
    icon.classList.remove("wi-cloudy")
    icon.classList.remove("wi-day-cloudy")
    icon.classList.remove("wi-day-sunny")
    if(data.hourly.rain[h] > 0 && data.hourly.snowfall[h] > 0){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Opady śniegu z deszczem`;
        icon.classList.add("wi-day-sleet")
        return;
    }
    else if(data.hourly.rain[h] > 0){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Opady deszczu`
        icon.classList.add("wi-day-rain")
    }
    else if(data.hourly.snowfall[h] > 0){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Opady śniegu`
        icon.classList.add("wi-day-snow-wind")
    }
    else if(data.hourly.cloud_cover[h] >= 80){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Mocno Pochmurnie`
        icon.classList.add("wi-cloudy")
    }
    else if(data.hourly.cloud_cover[h] >= 40){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Pochmurnie`
        icon.classList.add("wi-day-cloudy")
    }
    else {
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Słonecznie`
        icon.classList.add("wi-day-sunny")
    }
}
