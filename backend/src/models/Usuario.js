export class Usuario {
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
}