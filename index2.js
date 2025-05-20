const Promesa = new Promise((resolve, reject) => {
    const valor = 0.3;
    if (valor < 0.5){
        reject("Promesa rechazada");
    }
});

Promesa.then((mensaje) => {
    console.log(mensaje);
}).catch((error) => {
    console.error(error);
});
