const promesa = new Promise((resolve) => {setTimeout(()=>resolve("ya"), 2000)});
console.log("inicia")
promesa.then((mensaje) => { console.log(mensaje)});