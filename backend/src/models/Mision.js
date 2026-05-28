class Mision {
    constructor(idMision, nombre, descripcion = '', ejerciciosIds = []) {
        this.idMision = idMision;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.conjuntoDeEjer = ejerciciosIds;
        this.ejerciciosIds = ejerciciosIds;
    }

    // Método para añadir un ejercicio a la misión
    agregarEjercicio(ejercicio) {
        const id = ejercicio.id || ejercicio.idEjercicio;
        if (id !== undefined) {
            if (!this.conjuntoDeEjer.includes(id)) {
                this.conjuntoDeEjer.push(id);
            }
            if (!this.ejerciciosIds.includes(id)) {
                this.ejerciciosIds.push(id);
            }
        }
    }

    // Envia todos los ids de ejercicios almacenados en la misión
    cargarEjerciciosDeMision() {
        return this.conjuntoDeEjer;
    }
}

export default Mision;
