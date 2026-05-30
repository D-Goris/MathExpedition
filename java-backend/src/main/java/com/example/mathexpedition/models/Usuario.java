package com.example.mathexpedition.models;

public class Usuario {
    private String _idUsuario;
    private String idUsuario; // For backwards compatibility with some JSONs
    private String password;

    public Usuario() {}

    public Usuario(String idUsuario, String password) {
        this._idUsuario = idUsuario;
        this.idUsuario = idUsuario;
        this.password = password;
    }

    public String get_idUsuario() {
        return _idUsuario != null ? _idUsuario : idUsuario;
    }

    public void set_idUsuario(String _idUsuario) {
        this._idUsuario = _idUsuario;
    }

    public String getIdUsuario() {
        return idUsuario != null ? idUsuario : _idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
        this._idUsuario = idUsuario;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Nota: El encriptado/verificado de passwords se recomienda hacerlo en el Service,
    // pero mantenemos la firma para reflejar el modelo JS
    public static String encriptarPassword(String password) {
        // Simulación temporal, en Spring se usa BCryptPasswordEncoder en los servicios
        return "{bcrypt}" + password; 
    }

    public static boolean verificarPassword(String password, String hash) {
        if (hash == null) return false;
        return hash.equals("{bcrypt}" + password) || hash.equals(password);
    }
}
