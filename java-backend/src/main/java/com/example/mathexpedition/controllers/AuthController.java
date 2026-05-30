package com.example.mathexpedition.controllers;

import com.example.mathexpedition.models.Estudiante;
import com.example.mathexpedition.models.Maestro;
import com.example.mathexpedition.models.Usuario;
import com.example.mathexpedition.repository.EstudianteRepository;
import com.example.mathexpedition.repository.MaestroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private EstudianteRepository repoEstudiantes;

    @Autowired
    private MaestroRepository repoMaestros;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        String identificador = (String) body.get("identificador");
        String password = (String) body.get("password");
        String rol = (String) body.get("rol");

        if (identificador == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Faltan credenciales obligatorias.");
            return ResponseEntity.badRequest().body(error);
        }

        if ("estudiante".equals(rol) || rol == null || "".equals(rol)) {
            Estudiante estudiante = repoEstudiantes.obtenerTodos().stream()
                    .filter(e -> identificador.equals(e.get_idUsuario()) || 
                                 identificador.equals(e.getIdUsuario()) || 
                                 identificador.equals(e.getName()))
                    .findFirst().orElse(null);

            if (estudiante != null) {
                if (Usuario.verificarPassword(password, estudiante.getPassword())) {
                    Map<String, Object> user = new HashMap<>();
                    user.put("idUsuario", estudiante.get_idUsuario() != null ? estudiante.get_idUsuario() : estudiante.getIdUsuario());
                    user.put("name", estudiante.getName());
                    user.put("rol", "estudiante");

                    Map<String, Object> success = new HashMap<>();
                    success.put("success", true);
                    success.put("user", user);
                    return ResponseEntity.ok(success);
                }
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Contraseña incorrecta");
                return ResponseEntity.status(401).body(error);
            }
        }

        Maestro maestro = repoMaestros.obtenerTodos().stream()
                .filter(m -> identificador.equals(m.get_idUsuario()) || 
                             identificador.equals(m.getIdUsuario()) || 
                             identificador.equals(m.getEmail()))
                .findFirst().orElse(null);

        if (maestro != null) {
            if (Usuario.verificarPassword(password, maestro.getPassword())) {
                Map<String, Object> user = new HashMap<>();
                user.put("idUsuario", maestro.get_idUsuario() != null ? maestro.get_idUsuario() : maestro.getIdUsuario());
                user.put("name", maestro.getName());
                user.put("rol", "maestro");

                Map<String, Object> success = new HashMap<>();
                success.put("success", true);
                success.put("user", user);
                return ResponseEntity.ok(success);
            }
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Contraseña incorrecta");
            return ResponseEntity.status(401).body(error);
        }

        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "El usuario no se encuentra registrado.");
        return ResponseEntity.status(404).body(error);
    }

    @PostMapping("/registro-estudiante")
    public ResponseEntity<Map<String, Object>> registrarEstudiante(@RequestBody Map<String, Object> body) {
        String nombreCompleto = (String) body.get("nombreCompleto");
        String nombrePerfil = (String) body.get("nombrePerfil");
        String password = (String) body.get("password");

        if (nombreCompleto == null || nombrePerfil == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Faltan datos obligatorios para el registro.");
            return ResponseEntity.badRequest().body(error);
        }

        if (repoEstudiantes.obtenerPorNombrePerfil(nombrePerfil) != null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Ese nombre de explorador ya está en uso. ¡Elige otro!");
            return ResponseEntity.badRequest().body(error);
        }

        List<Estudiante> estudiantes = repoEstudiantes.obtenerTodos();
        String nuevoId = String.format("est-%03d", estudiantes.size() + 1);
        String passwordEncriptada = Usuario.encriptarPassword(password);

        Estudiante nuevo = new Estudiante(nuevoId, nombrePerfil);
        nuevo.setNombreCompleto(nombreCompleto);
        nuevo.setPassword(passwordEncriptada);
        repoEstudiantes.agregarEstudiante(nuevo);

        Map<String, Object> usuario = new HashMap<>();
        usuario.put("idUsuario", nuevoId);
        usuario.put("name", nombrePerfil);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "¡Explorador registrado con éxito!");
        success.put("usuario", usuario);
        return ResponseEntity.status(201).body(success);
    }

    @PostMapping("/registro-maestro")
    public ResponseEntity<Map<String, Object>> registrarMaestro(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String email = (String) body.get("email");
        String password = (String) body.get("password");

        if (name == null || email == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Faltan campos obligatorios (nombre, correo o contraseña)");
            return ResponseEntity.badRequest().body(error);
        }

        if (repoMaestros.obtenerPorEmail(email) != null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "El correo electrónico ya está registrado en el sistema.");
            return ResponseEntity.badRequest().body(error);
        }

        List<Maestro> maestros = repoMaestros.obtenerTodos();
        String nuevoId = String.format("prof-%03d", maestros.size() + 1);
        String passwordEncriptada = Usuario.encriptarPassword(password);

        Maestro nuevo = new Maestro(nuevoId, name, email, passwordEncriptada);
        repoMaestros.agregarMaestro(nuevo);

        Map<String, Object> usuario = new HashMap<>();
        usuario.put("idUsuario", nuevoId);
        usuario.put("name", name);
        usuario.put("email", email);

        Map<String, Object> success = new HashMap<>();
        success.put("success", true);
        success.put("message", "¡Profesor registrado exitosamente!");
        success.put("usuario", usuario);
        return ResponseEntity.status(201).body(success);
    }
}
