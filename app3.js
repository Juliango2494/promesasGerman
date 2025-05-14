const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.accuweather.com/es/co/medellin/107060/weather-forecast/107060';

axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);

    // Extraer el texto del div que contiene la temperatura actual
    const temperatura = $('#qlook .h2').first().text().trim();
    const descripcion = $('#qlook p').first().text().trim();

    console.log(`Temperatura en Medellín: ${temperatura}`);
    console.log(`Condición: ${descripcion}`);
  })
  .catch(error => {
    console.error('Error al obtener el clima:', error.message);
  });
