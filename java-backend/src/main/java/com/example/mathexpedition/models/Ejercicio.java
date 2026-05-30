package com.example.mathexpedition.models;

import java.util.HashMap;
import java.util.Map;

public class Ejercicio {
    private String id;
    private String nivelDificultad;
    private String enunciado;
    private String opcionA;
    private String opcionB;
    private String opcionC;
    private String opcionD;
    private Map<String, String> opciones;
    private String respuestaCorrecta;
    private String misionId;

    public Ejercicio() {}

    public Ejercicio(String id, String nivelDificultad, String enunciado, String opcionA, String opcionB, String opcionC, String opcionD, String respuestaCorrecta, String misionId) {
        this.id = id;
        this.nivelDificultad = nivelDificultad;
        this.enunciado = enunciado;
        this.opcionA = opcionA;
        this.opcionB = opcionB;
        this.opcionC = opcionC;
        this.opcionD = opcionD;
        
        this.opciones = new HashMap<>();
        this.opciones.put("A", opcionA);
        this.opciones.put("B", opcionB);
        this.opciones.put("C", opcionC);
        this.opciones.put("D", opcionD);
        
        this.respuestaCorrecta = respuestaCorrecta;
        this.misionId = misionId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNivelDificultad() { return nivelDificultad; }
    public void setNivelDificultad(String nivelDificultad) { this.nivelDificultad = nivelDificultad; }

    public String getEnunciado() { return enunciado; }
    public void setEnunciado(String enunciado) { this.enunciado = enunciado; }

    public String getOpcionA() { return opcionA; }
    public void setOpcionA(String opcionA) { this.opcionA = opcionA; }

    public String getOpcionB() { return opcionB; }
    public void setOpcionB(String opcionB) { this.opcionB = opcionB; }

    public String getOpcionC() { return opcionC; }
    public void setOpcionC(String opcionC) { this.opcionC = opcionC; }

    public String getOpcionD() { return opcionD; }
    public void setOpcionD(String opcionD) { this.opcionD = opcionD; }

    public Map<String, String> getOpciones() { return opciones; }
    public void setOpciones(Map<String, String> opciones) { this.opciones = opciones; }

    public String getRespuestaCorrecta() { return respuestaCorrecta; }
    public void setRespuestaCorrecta(String respuestaCorrecta) { this.respuestaCorrecta = respuestaCorrecta; }

    public String getMisionId() { return misionId; }
    public void setMisionId(String misionId) { this.misionId = misionId; }

    public Ejercicio obtenerVersionSegura() {
        Ejercicio seguro = new Ejercicio();
        seguro.setId(this.id);
        seguro.setNivelDificultad(this.nivelDificultad);
        seguro.setEnunciado(this.enunciado);
        seguro.setOpciones(this.opciones);
        seguro.setMisionId(this.misionId);
        return seguro;
    }

    public boolean comprobarRespuesta(String opcionSeleccionada) {
        if (opcionSeleccionada != null && opcionSeleccionada.equals(this.respuestaCorrecta)) {
            return true;
        } else {
            System.out.println("Respuesta incorrecta");
            return false;
        }
    }
}
