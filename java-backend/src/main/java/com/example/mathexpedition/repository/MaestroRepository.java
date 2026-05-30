package com.example.mathexpedition.repository;

import com.example.mathexpedition.models.Maestro;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MaestroRepository extends BaseRepository {

    private final String ARCHIVO = "maestro.json";

    public List<Maestro> obtenerTodos() {
        return leerJSON(ARCHIVO, new TypeReference<List<Maestro>>() {});
    }

    public Maestro obtenerPorId(String idUsuario) {
        return obtenerTodos().stream()
                .filter(m -> idUsuario.equals(m.get_idUsuario()) || idUsuario.equals(m.getIdUsuario()))
                .findFirst()
                .orElse(null);
    }

    public Maestro obtenerPorEmail(String email) {
        return obtenerTodos().stream()
                .filter(m -> email.equals(m.getEmail()))
                .findFirst()
                .orElse(null);
    }

    public boolean guardarTodos(List<Maestro> maestros) {
        return guardarJSON(ARCHIVO, maestros);
    }

    public boolean agregarMaestro(Maestro nuevoMaestro) {
        List<Maestro> maestros = obtenerTodos();
        maestros.add(nuevoMaestro);
        return guardarTodos(maestros);
    }
}
