async function ejecutarProceso() {
  console.log("Iniciando...");
  await esperarTresSegundos(); // Espera 3 segundos
  console.log("Proceso terminado");
}

function esperarTresSegundos() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Listo"), 3000);
  });
}
ejecutarProceso();