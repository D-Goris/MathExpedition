package com.example.mathexpedition.controllers;

import com.example.mathexpedition.models.Maestro;
import com.example.mathexpedition.repository.MaestroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/maestros")
@CrossOrigin(origins = "*")
public class MaestrosController {

    @Autowired
    private MaestroRepository repoMaestros;

    @GetMapping("/{id}/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfil(@PathVariable String id) {
        Maestro maestro = repoMaestros.obtenerPorId(id);

        if (maestro == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Perfil de profesor no encontrado");
            return ResponseEntity.status(404).body(error);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("idUsuario", maestro.get_idUsuario() != null ? maestro.get_idUsuario() : maestro.getIdUsuario());
        result.put("name", maestro.getName());
        result.put("email", maestro.getEmail());

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("perfil", result);
        return ResponseEntity.ok(success);
    }
}
