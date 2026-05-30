package com.example.mathexpedition.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BaseRepository {

    protected final String dataPath = "../backend/src/data/";
    protected final ObjectMapper mapper;

    public BaseRepository() {
        this.mapper = new ObjectMapper();
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    protected <T> List<T> leerJSON(String archivo, TypeReference<List<T>> typeReference) {
        File file = new File(dataPath + archivo);
        if (!file.exists()) {
            System.out.println("El archivo " + archivo + " no existe. Se devolverá un arreglo vacío.");
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(file, typeReference);
        } catch (IOException e) {
            System.err.println("Error al parsear el archivo " + archivo + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    protected <T> boolean guardarJSON(String archivo, List<T> datos) {
        File file = new File(dataPath + archivo);
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(file, datos);
            return true;
        } catch (IOException e) {
            System.err.println("Error al guardar el archivo " + archivo + ": " + e.getMessage());
            return false;
        }
    }
}
