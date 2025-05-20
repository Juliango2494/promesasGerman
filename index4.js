const promesa1 = new Promise((resolve, reject) => {
    function resolver() {
        resolve("primera")
    }
    setTimeout(resolver, 2000);
});

const promesa2 = new Promise((resolve, reject) => {
    function resolver() {
        resolve("segunda")
    }
    setTimeout(resolver, 4000);
});

const promesa3 = new Promise((resolve, reject) => {
    function resolver() {
        resolve("tercera")
    }
    setTimeout(resolver, 6000);
});


Promise.all([promesa1, promesa2, promesa3]).then((solucion) => {
    console.log(solucion);
}).catch((error) => {
    console.log(error);
})
