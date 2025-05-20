function esperarTresSegundos() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Listo"), 3000);
  });
}