class Grupo {
    constructor(idGrupo, nombre, descripcion, estudiantesIds = [], misionesIds = []) {
        this.idGrupo = idGrupo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estudiantesIds = estudiantesIds; // Array de IDs de estudiantes
        this.misionesIds = misionesIds; // Array de IDs de misiones asignadas
    }
}

export default Grupo;