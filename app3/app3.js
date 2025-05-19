const lat = 6.25184;
const lon = -75.56359;

const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

const metUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
const metHeaders = {
  "User-Agent": "mi-aplicacion-clima/1.0 contacto@ejemplo.com",
};

const weatherApiKey = '8cd3e1e9eef34c44965152718251905';
const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lon}`;

// Open-Meteo
async function obtenerClima() {
  const response = await fetch(openMeteoUrl);
  const data = await response.json();
  const clima = data.current_weather;
  return `🌤 Open-Meteo:\nTemperatura: ${clima.temperature}°C\nViento: ${clima.windspeed} km/h\nHora: ${clima.time}`;
}

// MET.no
async function obtenerClima2() {
  const response = await fetch(metUrl, { headers: metHeaders });
  const data = await response.json();
  const t = data.properties.timeseries[0];
  const d = t.data.instant.details;
  return `🌤 MET.no:\nTemperatura: ${d.air_temperature}°C\nViento: ${d.wind_speed} m/s\nHora: ${t.time}`;
}

// WeatherAPI.com
async function obtenerClima3() {
  const response = await fetch(weatherApiUrl);
  const data = await response.json();
  return `🌤 WeatherAPI.com:\nTemperatura: ${data.current.temp_c}°C\nViento: ${data.current.wind_kph} km/h\nHora: ${data.location.localtime}`;
}

// Solo muestra el resultado del más rápido
Promise.race([
  obtenerClima(),
  obtenerClima2(),
  obtenerClima3()
])
.then(resultado => {
  console.log("Primer resultado recibido:");
  console.log(resultado);
})
.catch(error => {
  console.error("Error al obtener el clima:", error);
});
