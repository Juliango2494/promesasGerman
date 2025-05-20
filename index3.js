// 3. Encadenamiento de Promesas
// Simular un flujo de pasos donde cada paso tarda 1 segundo en completarse. Usar tres promesas y encadenarlas con .then() para que se ejecuten en orden.

console.log("Inicia");

const paso1 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Paso 1 completado");
        }, 1000);
    });
};

const paso2 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Paso 2 completado");
        }, 1000);
    });
};

const paso3 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Paso 3 completado");
        }, 1000);
    });
};

paso1()
    .then((resultado1) => {
        console.log(resultado1);
        return paso2();
    })
    .then((resultado2) => {
        console.log(resultado2);
        return paso3();
    })
    .then((resultado3) => {
        console.log(resultado3);
        console.log("Todos los pasos han sido completados");
    });
