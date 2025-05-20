function buscar(id) {
  const tiempo = Math.floor(Math.random() * 2000) + 1000; // entre 1000 y 3000 ms
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Resultado de búsqueda ${id} (en ${tiempo}ms)`);
    }, tiempo);
  });
}
async function realizarBusquedas() {
  console.log("Iniciando búsquedas...");

  const promesas = [
    buscar(1),
    buscar(2),
    buscar(3)
  ];

  const resultados = await Promise.all(promesas);

  console.log("Resultados:", resultados);
}

realizarBusquedas();