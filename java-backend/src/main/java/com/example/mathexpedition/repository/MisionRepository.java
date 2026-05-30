package com.example.mathexpedition.repository;

import com.example.mathexpedition.models.Mision;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MisionRepository extends BaseRepository {

    private final String ARCHIVO = "misiones.json";

    public List<Mision> obtenerTodos() {
        return leerJSON(ARCHIVO, new TypeReference<List<Mision>>() {});
    }

    public Mision obtenerPorId(String idMision) {
        return obtenerTodos().stream()
                .filter(m -> idMision.equals(m.getIdMision()))
                .findFirst()
                .orElse(null);
    }

    public boolean guardarTodos(List<Mision> misiones) {
        return guardarJSON(ARCHIVO, misiones);
    }

    public boolean agregarMision(Mision nuevaMision) {
        List<Mision> misiones = obtenerTodos();
        misiones.add(nuevaMision);
        return guardarTodos(misiones);
    }

    public boolean actualizarMision(String idMision, Mision datosActualizados) {
        List<Mision> misiones = obtenerTodos();
        for (int i = 0; i < misiones.size(); i++) {
            Mision m = misiones.get(i);
            if (idMision.equals(m.getIdMision())) {
                if (datosActualizados.getNombre() != null) m.setNombre(datosActualizados.getNombre());
                if (datosActualizados.getDescripcion() != null) m.setDescripcion(datosActualizados.getDescripcion());
                if (datosActualizados.getEjerciciosIds() != null) m.setEjerciciosIds(datosActualizados.getEjerciciosIds());
                if (datosActualizados.getConjuntoDeEjer() != null) m.setConjuntoDeEjer(datosActualizados.getConjuntoDeEjer());
                
                misiones.set(i, m);
                return guardarTodos(misiones);
            }
        }
        return false;
    }
}
