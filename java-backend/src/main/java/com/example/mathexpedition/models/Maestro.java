package com.example.mathexpedition.models;

import java.util.ArrayList;
import java.util.List;

public class Maestro extends Usuario {
    private String name;
    private String email;

    public Maestro() {
        super();
    }

    public Maestro(String idUsuario, String name, String email, String password) {
        super(idUsuario, password);
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Object verAvanceIndividual(Estudiante estudiante) {
        System.out.println("Mostrando avance individual de: " + estudiante.getName());
        return new Object();
    }

    public Object verAvanceColectivo() {
        System.out.println("Mostrando avance colectivo del grupo.");
        return new Object();
    }

    public List<Object> filtrarInformacion(String criterio) {
        System.out.println("Filtrando estudiantes por criterio: " + criterio);
        return new ArrayList<>();
    }
}
