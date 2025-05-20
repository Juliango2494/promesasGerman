function simularTarea() {
  return new Promise((resolve, reject) => {
    function pendiente() {
      resolve(4000);
    }
    setTimeout(pendiente, 4000)
  })
}

async function tareaAsincrona() {
  console.log("Iniciando tarea...");
  const valor = await simularTarea();
  console.log("Hola Mundo");
}

tareaAsincrona();