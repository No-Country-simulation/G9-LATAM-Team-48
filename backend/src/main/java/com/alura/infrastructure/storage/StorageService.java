package com.alura.infrastructure.storage;

/**
 * Abstraccion de almacenamiento de archivos/objetos.
 *
 * <p>Desacopla la aplicacion del proveedor concreto de almacenamiento (sistema
 * de archivos local, OCI Object Storage, S3, etc.). Sin implementacion todavia.</p>
 */
public interface StorageService {

    // TODO: String store(String key, byte[] content);
    // TODO: byte[] retrieve(String key);
}
