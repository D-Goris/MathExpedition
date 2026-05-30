package com.example.mathexpedition.controllers;

import com.example.mathexpedition.models.Grupo;
import com.example.mathexpedition.repository.GrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/grupos")
@CrossOrigin(origins = "*")
public class GruposController {

    @Autowired
    private GrupoRepository repoGrupos;

    @GetMapping
    public ResponseEntity<List<Grupo>> obtenerGrupos() {
        return ResponseEntity.ok(repoGrupos.obtenerTodos());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearGrupo(@RequestBody Map<String, Object> body) {
        String nombre = (String) body.get("nombre");
        String descripcion = (String) body.get("descripcion");

        if (nombre == null || descripcion == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Faltan campos (nombre o descripción).");
            return ResponseEntity.badRequest().body(error);
        }

        List<Grupo> grupos = repoGrupos.obtenerTodos();
        for (Grupo g : grupos) {
            if (g.getNombre().equalsIgnoreCase(nombre)) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "El grupo ya existe");
                return ResponseEntity.badRequest().body(error);
            }
        }

        String nuevoId = "grupo-" + System.currentTimeMillis();
        Grupo nuevoGrupo = new Grupo(nuevoId, nombre, descripcion, null, null);
        repoGrupos.agregarGrupo(nuevoGrupo);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "Grupo creado");
        success.put("grupo", nuevoGrupo);
        return ResponseEntity.status(201).body(success);
    }

    @PostMapping("/{idGrupo}/asignar-alumno")
    public ResponseEntity<Map<String, Object>> asignarAlumno(@PathVariable String idGrupo, @RequestBody Map<String, Object> body) {
        String idAlumno = (String) body.get("idAlumno");
        if (idAlumno == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Se requiere el idAlumno");
            return ResponseEntity.badRequest().body(error);
        }

        List<Grupo> grupos = repoGrupos.obtenerTodos();
        Grupo grupoTarget = null;

        for (Grupo g : grupos) {
            if (idGrupo.equals(g.getIdGrupo())) {
                grupoTarget = g;
            }
            if (g.getEstudiantesIds() != null) {
                g.getEstudiantesIds().remove(idAlumno);
            }
        }

        if (grupoTarget == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Grupo no encontrado");
            return ResponseEntity.badRequest().body(error);
        }

        grupoTarget.getEstudiantesIds().add(idAlumno);
        repoGrupos.guardarTodos(grupos);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "Alumno asignado correctamente");
        return ResponseEntity.ok(success);
    }

    @PostMapping("/{idGrupo}/remover-alumno")
    public ResponseEntity<Map<String, Object>> removerAlumno(@PathVariable String idGrupo, @RequestBody Map<String, Object> body) {
        String idAlumno = (String) body.get("idAlumno");
        if (idAlumno == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Se requiere el idAlumno");
            return ResponseEntity.badRequest().body(error);
        }

        List<Grupo> grupos = repoGrupos.obtenerTodos();
        Grupo grupoTarget = null;

        for (Grupo g : grupos) {
            if (idGrupo.equals(g.getIdGrupo())) {
                grupoTarget = g;
                break;
            }
        }

        if (grupoTarget == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Grupo no encontrado");
            return ResponseEntity.badRequest().body(error);
        }

        if (grupoTarget.getEstudiantesIds() != null) {
            grupoTarget.getEstudiantesIds().remove(idAlumno);
        }

        repoGrupos.guardarTodos(grupos);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "Alumno removido correctamente");
        return ResponseEntity.ok(success);
    }

    @PostMapping("/{idGrupo}/asignar-mision")
    public ResponseEntity<Map<String, Object>> asignarMision(@PathVariable String idGrupo, @RequestBody Map<String, Object> body) {
        Object idMisionObj = body.get("idMision");
        if (idMisionObj == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Se requiere el idMision");
            return ResponseEntity.badRequest().body(error);
        }

        String idMisionStr = String.valueOf(idMisionObj);

        List<Grupo> grupos = repoGrupos.obtenerTodos();
        Grupo grupoTarget = null;

        for (Grupo g : grupos) {
            if (idGrupo.equals(g.getIdGrupo())) {
                grupoTarget = g;
                break;
            }
        }

        if (grupoTarget == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Grupo no encontrado");
            return ResponseEntity.badRequest().body(error);
        }

        if (!grupoTarget.getMisionesIds().contains(idMisionStr)) {
            grupoTarget.getMisionesIds().add(idMisionStr);
        }

        repoGrupos.guardarTodos(grupos);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "Misión asignada correctamente");
        return ResponseEntity.ok(success);
    }
}
