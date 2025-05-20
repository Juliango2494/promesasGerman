const promesaRapida = new Promise((resolve) => {
  setTimeout(() => resolve("Promesa rápida (2s)"), 2000);
});

const promesaLenta = new Promise((resolve) => {
  setTimeout(() => resolve("Promesa lenta (5s)"), 5000);
});

Promise.race([promesaRapida, promesaLenta])
  .then((resultado) => {
    console.log("Ganó:", resultado);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
