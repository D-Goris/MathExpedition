package com.example.mathexpedition.controllers;

import com.example.mathexpedition.models.Ejercicio;
import com.example.mathexpedition.models.Mision;
import com.example.mathexpedition.repository.EjercicioRepository;
import com.example.mathexpedition.repository.MisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/misiones")
@CrossOrigin(origins = "*")
public class MisionesController {

    @Autowired
    private MisionRepository repoMisiones;

    @Autowired
    private EjercicioRepository repoEjercicios;

    @GetMapping
    public ResponseEntity<List<Mision>> obtenerMisiones() {
        return ResponseEntity.ok(repoMisiones.obtenerTodos());
    }

    @GetMapping("/{id}/ejercicios")
    public ResponseEntity<Object> obtenerEjerciciosPorMision(@PathVariable String id) {
        Mision mision = repoMisiones.obtenerPorId(id);
        if (mision == null) {
            Map<String, String> error = new HashMap<>();
            error.put("msg", "No se encontró la misión con ID " + id);
            return ResponseEntity.status(404).body(error);
        }

        List<Ejercicio> ejercicios = repoEjercicios.obtenerTodos();
        List<Ejercicio> ejerciciosDeLaMision = ejercicios.stream()
                .filter(e -> mision.getEjerciciosIds() != null && mision.getEjerciciosIds().contains(e.getId()))
                .toList();

        return ResponseEntity.ok(ejerciciosDeLaMision);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearMision(@RequestBody Map<String, Object> body) {
        String nombre = (String) body.get("nombre");
        if (nombre == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("msg", "Se requiere el nombre de la misión");
            return ResponseEntity.badRequest().body(error);
        }

        List<Mision> misiones = repoMisiones.obtenerTodos();
        for (Mision m : misiones) {
            if (m.getNombre() != null && m.getNombre().equalsIgnoreCase(nombre)) {
                Map<String, Object> error = new HashMap<>();
                error.put("msg", "Ya existe una misión con ese nombre");
                return ResponseEntity.badRequest().body(error);
            }
        }

        long nuevoIdLong = misiones.isEmpty() ? 1 : misiones.stream().mapToLong(m -> {
            try { return Long.parseLong(m.getIdMision()); } catch (Exception e) { return 0; }
        }).max().orElse(0) + 1;
        String nuevoId = String.valueOf(nuevoIdLong);

        Mision nuevaMision = new Mision(nuevoId, nombre, "", null);
        repoMisiones.agregarMision(nuevaMision);

        Map<String, Object> success = new HashMap<>();
        success.put("msg", "Misión creada exitosamente");
        success.put("mision", nuevaMision);
        return ResponseEntity.status(201).body(success);
    }

    @PostMapping("/{id}/ejercicios")
    public ResponseEntity<Map<String, Object>> crearEjercicio(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String pregunta = (String) body.get("pregunta");
        String opA = (String) body.get("opA");
        String opB = (String) body.get("opB");
        String opC = (String) body.get("opC");
        String opD = (String) body.get("opD");
        String correcta = (String) body.get("correcta");

        if (pregunta == null || opA == null || opB == null || opC == null || opD == null || correcta == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("msg", "Faltan campos obligatorios para crear el ejercicio");
            return ResponseEntity.badRequest().body(error);
        }

        Mision mision = repoMisiones.obtenerPorId(id);
        if (mision == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("msg", "La misión destino no existe");
            return ResponseEntity.status(404).body(error);
        }

        List<Ejercicio> ejercicios = repoEjercicios.obtenerTodos();
        long nuevoIdLong = ejercicios.isEmpty() ? 1 : ejercicios.stream().mapToLong(e -> {
            try { return Long.parseLong(e.getId()); } catch (Exception ex) { return 0; }
        }).max().orElse(0) + 1;
        String nuevoId = String.valueOf(nuevoIdLong);

        Ejercicio nuevoEjercicio = new Ejercicio(nuevoId, "1", pregunta, opA, opB, opC, opD, correcta, id);
        repoEjercicios.agregarEjercicio(nuevoEjercicio);

        mision.agregarEjercicio(nuevoId);
        repoMisiones.actualizarMision(id, mision);

        Map<String, Object> success = new HashMap<>();
        success.put("msg", "¡Ejercicio creado e inyectado a la misión con éxito!");
        success.put("ejercicio", nuevoEjercicio);
        return ResponseEntity.status(201).body(success);
    }
}
