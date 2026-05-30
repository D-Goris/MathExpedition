package com.example.mathexpedition.controllers;

import com.example.mathexpedition.models.Estudiante;
import com.example.mathexpedition.models.Grupo;
import com.example.mathexpedition.repository.EstudianteRepository;
import com.example.mathexpedition.repository.GrupoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "*")
public class EstudiantesController {

    @Autowired
    private EstudianteRepository repoEstudiantes;

    @Autowired
    private GrupoRepository repoGrupos;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> obtenerEstudiantes() {
        List<Estudiante> estudiantes = repoEstudiantes.obtenerTodos();
        List<Grupo> grupos = repoGrupos.obtenerTodos();

        List<Map<String, Object>> result = estudiantes.stream().map(est -> {
            Map<String, Object> estSeguro = new HashMap<>();
            estSeguro.put("idUsuario", est.get_idUsuario());
            estSeguro.put("name", est.getName());
            estSeguro.put("nombreCompleto", est.getNombreCompleto());
            estSeguro.put("ejerciciosResueltos", est.getEjerciciosResueltos());
            estSeguro.put("registrosAvance", est.getRegistrosAvance());

            Grupo grupoAsignado = grupos.stream()
                    .filter(g -> g.getEstudiantesIds() != null && g.getEstudiantesIds().contains(est.get_idUsuario()))
                    .findFirst()
                    .orElse(null);

            estSeguro.put("grupo", grupoAsignado != null ? grupoAsignado.getNombre() : "");
            estSeguro.put("grupoKey", grupoAsignado != null ? grupoAsignado.getIdGrupo() : "");

            return estSeguro;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{idEstudiante}/misiones")
    public ResponseEntity<Map<String, Object>> obtenerMisionesAsignadas(@PathVariable String idEstudiante) {
        List<Grupo> grupos = repoGrupos.obtenerTodos();
        Grupo grupoAsignado = grupos.stream()
                .filter(g -> g.getEstudiantesIds() != null && g.getEstudiantesIds().contains(idEstudiante))
                .findFirst()
                .orElse(null);

        if (grupoAsignado == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "El estudiante no está asignado a ningún grupo");
            return ResponseEntity.status(404).body(error);
        }

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("misionesIds", grupoAsignado.getMisionesIds() != null ? grupoAsignado.getMisionesIds() : new ArrayList<>());
        success.put("grupo", grupoAsignado.getNombre());
        return ResponseEntity.ok(success);
    }

    @PostMapping("/{idEstudiante}/avance")
    public ResponseEntity<Map<String, Object>> guardarAvance(@PathVariable String idEstudiante, @RequestBody Map<String, Object> body) {
        Object idEjercicioObj = body.get("idEjercicio");
        if (idEjercicioObj == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Falta el idEjercicio");
            return ResponseEntity.badRequest().body(error);
        }
        
        String idEjercicioStr = String.valueOf(idEjercicioObj);
        Estudiante estudianteEncontrado = repoEstudiantes.obtenerPorId(idEstudiante);

        if (estudianteEncontrado == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Estudiante no encontrado");
            return ResponseEntity.badRequest().body(error);
        }

        List<String> ejercicios = estudianteEncontrado.getEjerciciosResueltos();
        if (ejercicios == null) {
            ejercicios = new ArrayList<>();
            estudianteEncontrado.setEjerciciosResueltos(ejercicios);
        }

        if (!ejercicios.contains(idEjercicioStr)) {
            ejercicios.add(idEjercicioStr);
        }

        repoEstudiantes.actualizarEstudiante(idEstudiante, estudianteEncontrado);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "Avance guardado exitosamente");
        return ResponseEntity.ok(success);
    }
}
