package com.example.mathexpedition.models;

import java.util.ArrayList;
import java.util.List;

public class Grupo {
    private String idGrupo;
    private String nombre;
    private String descripcion;
    private List<String> estudiantesIds;
    private List<String> misionesIds;

    public Grupo() {
        this.estudiantesIds = new ArrayList<>();
        this.misionesIds = new ArrayList<>();
    }

    public Grupo(String idGrupo, String nombre, String descripcion, List<String> estudiantesIds, List<String> misionesIds) {
        this.idGrupo = idGrupo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estudiantesIds = estudiantesIds != null ? estudiantesIds : new ArrayList<>();
        this.misionesIds = misionesIds != null ? misionesIds : new ArrayList<>();
    }

    public String getIdGrupo() { return idGrupo; }
    public void setIdGrupo(String idGrupo) { this.idGrupo = idGrupo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<String> getEstudiantesIds() { return estudiantesIds; }
    public void setEstudiantesIds(List<String> estudiantesIds) { this.estudiantesIds = estudiantesIds; }

    public List<String> getMisionesIds() { return misionesIds; }
    public void setMisionesIds(List<String> misionesIds) { this.misionesIds = misionesIds; }
}
