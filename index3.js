// 3. Encadenamiento de Promesas
// Simular un flujo de pasos donde cada paso tarda 1 segundo en completarse. Usar tres promesas y encadenarlas con .then() para que se ejecuten en orden.

const promesa2 = new Promise((resolve) => {setTimeout(()=>resolve("ya"), 2000)});
console.log("inicia")
promesa2.then((mensaje) => { console.log(mensaje)});

const promesEncad = new Promise((resolve, reject)=>{
    resolve("Iniciando el paso 1")
}
);