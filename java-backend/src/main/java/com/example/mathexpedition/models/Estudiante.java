package com.example.mathexpedition.models;

import java.util.ArrayList;
import java.util.List;

public class Estudiante extends Usuario {
    private String name;
    private String nombreCompleto;
    private List<String> ejerciciosResueltos;
    private List<String> registrosAvance;

    public Estudiante() {
        super();
        this.ejerciciosResueltos = new ArrayList<>();
        this.registrosAvance = new ArrayList<>();
    }

    public Estudiante(String idUsuario, String name) {
        super(idUsuario, "");
        this.name = name;
        this.nombreCompleto = "";
        this.ejerciciosResueltos = new ArrayList<>();
        this.registrosAvance = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public List<String> getEjerciciosResueltos() {
        return ejerciciosResueltos;
    }

    public void setEjerciciosResueltos(List<String> ejerciciosResueltos) {
        this.ejerciciosResueltos = ejerciciosResueltos;
    }

    public List<String> getRegistrosAvance() {
        return registrosAvance;
    }

    public void setRegistrosAvance(List<String> registrosAvance) {
        this.registrosAvance = registrosAvance;
    }

    public String realizarEjercicio(String idEjercicio) {
        if (!this.ejerciciosResueltos.contains(idEjercicio)) {
            this.ejerciciosResueltos.add(idEjercicio);
        }
        return "Ejercicio " + idEjercicio + " registrado en el avance.";
    }
}
