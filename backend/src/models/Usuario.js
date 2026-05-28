import bcrypt from 'bcryptjs';

class Usuario {
    constructor(idUsuario, password) {
        this._idUsuario = idUsuario;
        this.password = password;
    }

    get idUsuario() {
        return this._idUsuario;
    }

    set idUsuario(val) {
        this._idUsuario = val;
    }

    /**
     * Genera un hash seguro para la contraseña usando bcryptjs.
     * @param {string} password 
     * @returns {string} Hash de la contraseña.
     */
    static encriptarPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * Compara la contraseña en texto plano con el hash guardado.
     * @param {string} password 
     * @param {string} hash 
     * @returns {boolean} True si coinciden, false si no.
     */
    static verificarPassword(password, hash) {
        if (!hash) return false;
        return bcrypt.compareSync(password, hash);
    }
}
export default Usuario;
