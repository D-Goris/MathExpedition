import ejercicios from "./Ejercicio";

export class Mision{

constructor(idMision, nombre,){
  this.idMision = idMision;
  this.nombre = nombre;
  this.conjuntoDeEjer = [];

}

//Metodo para añadir un ejercicio a la mision

  agregarEjercicio(ejercicio){
    const adicion = ejercicio.id;
    this.conjuntoDeEjer.push(adicion);
}

  //envia todods los ids de ejercicios almacenados en la mision

  cargarEjerciciosDeMision(){
    return this.conjuntoDeEjer;

}
}