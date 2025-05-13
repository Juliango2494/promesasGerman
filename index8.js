function delay() {
  return new Promise((resolve, reject) => {
    function pendiente() {
      resolve(4000);
    }
    setTimeout(pendiente, 1000)
  })
}
let nombres =["Julian","Juan","Camilo"]
async function procesarNombres(nombres) {
for (const nombre of nombres) {
await delay(1000);
console.log(`Procesado: ${nombre}`);
}
}

procesarNombres(nombres);
