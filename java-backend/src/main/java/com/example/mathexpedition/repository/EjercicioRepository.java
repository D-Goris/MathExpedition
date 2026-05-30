package com.example.mathexpedition.repository;

import com.example.mathexpedition.models.Ejercicio;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class EjercicioRepository extends BaseRepository {

    private final String ARCHIVO = "ejercicios.json";

    public List<Ejercicio> obtenerTodos() {
        return leerJSON(ARCHIVO, new TypeReference<List<Ejercicio>>() {});
    }

    public Ejercicio obtenerPorId(String idEjercicio) {
        return obtenerTodos().stream()
                .filter(e -> idEjercicio.equals(e.getId()))
                .findFirst()
                .orElse(null);
    }

    public boolean guardarTodos(List<Ejercicio> ejercicios) {
        return guardarJSON(ARCHIVO, ejercicios);
    }

    public boolean agregarEjercicio(Ejercicio nuevoEjercicio) {
        List<Ejercicio> ejercicios = obtenerTodos();
        ejercicios.add(nuevoEjercicio);
        return guardarTodos(ejercicios);
    }

    public List<Ejercicio> obtenerPorMision(String misionId) {
        return obtenerTodos().stream()
                .filter(e -> misionId.equals(e.getMisionId()))
                .collect(Collectors.toList());
    }
}
