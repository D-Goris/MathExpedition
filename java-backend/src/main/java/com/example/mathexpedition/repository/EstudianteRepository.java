package com.example.mathexpedition.repository;

import com.example.mathexpedition.models.Estudiante;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class EstudianteRepository extends BaseRepository {

    private final String ARCHIVO = "estudiantes.json";

    public List<Estudiante> obtenerTodos() {
        return leerJSON(ARCHIVO, new TypeReference<List<Estudiante>>() {});
    }

    public Estudiante obtenerPorId(String idUsuario) {
        return obtenerTodos().stream()
                .filter(e -> idUsuario.equals(e.get_idUsuario()) || idUsuario.equals(e.getIdUsuario()))
                .findFirst()
                .orElse(null);
    }

    public Estudiante obtenerPorNombrePerfil(String name) {
        return obtenerTodos().stream()
                .filter(e -> name.equals(e.getName()))
                .findFirst()
                .orElse(null);
    }

    public boolean guardarTodos(List<Estudiante> estudiantes) {
        return guardarJSON(ARCHIVO, estudiantes);
    }

    public boolean agregarEstudiante(Estudiante nuevoEstudiante) {
        List<Estudiante> estudiantes = obtenerTodos();
        estudiantes.add(nuevoEstudiante);
        return guardarTodos(estudiantes);
    }

    public boolean actualizarEstudiante(String idUsuario, Estudiante datosActualizados) {
        List<Estudiante> estudiantes = obtenerTodos();
        for (int i = 0; i < estudiantes.size(); i++) {
            Estudiante e = estudiantes.get(i);
            if (idUsuario.equals(e.get_idUsuario()) || idUsuario.equals(e.getIdUsuario())) {
                // Actualizar campos permitidos (simulando ...datosActualizados en JS)
                if (datosActualizados.getName() != null) e.setName(datosActualizados.getName());
                if (datosActualizados.getNombreCompleto() != null) e.setNombreCompleto(datosActualizados.getNombreCompleto());
                if (datosActualizados.getEjerciciosResueltos() != null) e.setEjerciciosResueltos(datosActualizados.getEjerciciosResueltos());
                if (datosActualizados.getRegistrosAvance() != null) e.setRegistrosAvance(datosActualizados.getRegistrosAvance());
                
                estudiantes.set(i, e);
                return guardarTodos(estudiantes);
            }
        }
        return false;
    }
}
