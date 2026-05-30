package com.example.mathexpedition.repository;

import com.example.mathexpedition.models.Grupo;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GrupoRepository extends BaseRepository {

    private final String ARCHIVO = "grupos.json";

    public List<Grupo> obtenerTodos() {
        return leerJSON(ARCHIVO, new TypeReference<List<Grupo>>() {});
    }

    public Grupo obtenerPorId(String idGrupo) {
        return obtenerTodos().stream()
                .filter(g -> idGrupo.equals(g.getIdGrupo()))
                .findFirst()
                .orElse(null);
    }

    public boolean guardarTodos(List<Grupo> grupos) {
        return guardarJSON(ARCHIVO, grupos);
    }

    public boolean agregarGrupo(Grupo nuevoGrupo) {
        List<Grupo> grupos = obtenerTodos();
        grupos.add(nuevoGrupo);
        return guardarTodos(grupos);
    }

    public boolean actualizarGrupo(String idGrupo, Grupo datosActualizados) {
        List<Grupo> grupos = obtenerTodos();
        for (int i = 0; i < grupos.size(); i++) {
            Grupo g = grupos.get(i);
            if (idGrupo.equals(g.getIdGrupo())) {
                if (datosActualizados.getNombre() != null) g.setNombre(datosActualizados.getNombre());
                if (datosActualizados.getDescripcion() != null) g.setDescripcion(datosActualizados.getDescripcion());
                if (datosActualizados.getEstudiantesIds() != null) g.setEstudiantesIds(datosActualizados.getEstudiantesIds());
                if (datosActualizados.getMisionesIds() != null) g.setMisionesIds(datosActualizados.getMisionesIds());
                
                grupos.set(i, g);
                return guardarTodos(grupos);
            }
        }
        return false;
    }
}
