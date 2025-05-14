
const fs =require("fs");
function CrearArchivo(contenido,nombreArchivo){ return new Promise((resolve, reject) => { 
  fs.writeFile(nombreArchivo,contenido,"utf-8",(error)=>{
    if(error){
      console.error("Error")
      reject(error)
    }else{
      console.log(`creado "${nombreArchivo}" con éxito`)
      resolve(true)

    }
  })
 }) }

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
cant = 10;
async function iterar() {
for (let i = 1; i <= cant; i++) {

await delay(1);
CrearArchivo("hola",`jelou_${i}.txt`);

}
}

iterar();