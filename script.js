const cityInput = document.querySelector("#city")
const timeInput = document.querySelector("#time")
const cityDisplay = document.querySelector("#cityName")
const temp = document.querySelector("#temp")
const desc = document.querySelector("#weather-desc")
const icon = document.querySelector("#weather-icon")
const clouds = document.querySelector("#clouds")
const rain = document.querySelector("#rain")
const snow = document.querySelector("#snow")
const error = document.querySelector("#error")


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
        default:
            return;
    }
    
    if(timeInput.value == "Teraz"){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${long.toFixed(2)}&current=temperature_2m,rain,snowfall,cloud_cover&hourly=temperature_2m,rain,snowfall,cloud_cover&timezone=Europe%2FBerlin`)
        .then(res => res.json())
        .then(data => writeViewNow(data));
    }
    else {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${long.toFixed(2)}&current=temperature_2m,rain,snowfall,cloud_cover&hourly=temperature_2m,rain,snowfall,cloud_cover&timezone=Europe%2FBerlin`)
        .then(res => res.json())
        .then(data => writeViewLater(data));
    }
}
const writeViewNow = (data) =>{
    cityDisplay.textContent = `${cityInput.value} - Teraz`
    temp.innerHTML = `<i class="wi wi-thermometer"></i>  Temperatura: ${data.current.temperature_2m}°C`;
    clouds.innerHTML = `<i class="wi wi-cloudy"></i>  Zachmurzenie: ${data.current.cloud_cover.toFixed(2)}%`
    rain.innerHTML = `<i class="wi wi-sprinkle"></i>  Ilość deszczu ${data.current.rain}mm`
    snow.innerHTML = `<i class="wi wi-snow"></i>  Ilość śniegu: ${data.current.snowfall}cm`
    icon.classList.remove("wi-cloud");
    icon.classList.remove("wi-day-sleet")
    icon.classList.remove("wi-day-rain")
    icon.classList.remove("wi-day-snow-wind")
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
    else if(data.current.cloud_cover >= 45){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Pochmurnie`
        icon.classList.add("wi-day-cloudy")
    }
    else {
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Słonecznie`
        icon.classList.add("wi-day-sunny")
    }
}
const writeViewLater = (data) =>{
    let h = timeInput.value - 1;
    cityDisplay.textContent = `${cityInput.value} - Za ${timeInput.value}h`
    temp.innerHTML = `<i class="wi wi-thermometer"></i>  Temperatura: ${data.hourly.temperature_2m[h]}°C`;
    clouds.innerHTML = `<i class="wi wi-cloudy"></i>  Zachmurzenie: ${data.hourly.cloud_cover[h].toFixed(2)}%`
    rain.innerHTML = `<i class="wi wi-sprinkle"></i>  Ilość deszczu ${data.hourly.rain[h]}mm`
    snow.innerHTML = `<i class="wi wi-snow"></i>  Ilość śniegu: ${data.hourly.snowfall[h]}cm`
    icon.classList.remove("wi-cloud");
    icon.classList.remove("wi-day-sleet")
    icon.classList.remove("wi-day-rain")
    icon.classList.remove("wi-day-snow-wind")
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
    else if(data.hourly.cloud_cover[h] >= 45){
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Pochmurnie`
        icon.classList.add("wi-day-cloudy")
    }
    else {
        desc.innerHTML = `<i class="wi wi-cloud"></i>  Słonecznie`
        icon.classList.add("wi-day-sunny")
    }
}
