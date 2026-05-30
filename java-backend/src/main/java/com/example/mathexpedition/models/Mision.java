package com.example.mathexpedition.models;

import java.util.ArrayList;
import java.util.List;

public class Mision {
    private String idMision;
    private String nombre;
    private String descripcion;
    private List<String> conjuntoDeEjer;
    private List<String> ejerciciosIds;

    public Mision() {
        this.conjuntoDeEjer = new ArrayList<>();
        this.ejerciciosIds = new ArrayList<>();
    }

    public Mision(String idMision, String nombre, String descripcion, List<String> ejerciciosIds) {
        this.idMision = idMision;
        this.nombre = nombre;
        this.descripcion = descripcion != null ? descripcion : "";
        this.conjuntoDeEjer = ejerciciosIds != null ? new ArrayList<>(ejerciciosIds) : new ArrayList<>();
        this.ejerciciosIds = ejerciciosIds != null ? new ArrayList<>(ejerciciosIds) : new ArrayList<>();
    }

    public String getIdMision() { return idMision; }
    public void setIdMision(String idMision) { this.idMision = idMision; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<String> getConjuntoDeEjer() { return conjuntoDeEjer; }
    public void setConjuntoDeEjer(List<String> conjuntoDeEjer) { this.conjuntoDeEjer = conjuntoDeEjer; }

    public List<String> getEjerciciosIds() { return ejerciciosIds; }
    public void setEjerciciosIds(List<String> ejerciciosIds) { this.ejerciciosIds = ejerciciosIds; }

    public void agregarEjercicio(String idEjercicio) {
        if (idEjercicio != null) {
            if (!this.conjuntoDeEjer.contains(idEjercicio)) {
                this.conjuntoDeEjer.add(idEjercicio);
            }
            if (!this.ejerciciosIds.contains(idEjercicio)) {
                this.ejerciciosIds.add(idEjercicio);
            }
        }
    }

    public List<String> cargarEjerciciosDeMision() {
        return this.conjuntoDeEjer;
    }
}
