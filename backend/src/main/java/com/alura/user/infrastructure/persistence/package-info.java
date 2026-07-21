/**
 * Capa de persistencia (infrastructure layer).
 *
 * <p>Contiene las implementaciones concretas de los repositorios del dominio,
 * adaptándolos a la tecnología de almacenamiento (MySQL con JPA).</p>
 *
 * <ul>
 *   <li>{@link com.alura.user.infrastructure.persistence.UserEntity} - Entidad JPA</li>
 *   <li>{@link com.alura.user.infrastructure.persistence.UserRepositoryJpa} - Spring Data JPA</li>
 *   <li>{@link com.alura.user.infrastructure.persistence.JpaUserRepositoryAdapter} - Adaptador</li>
 * </ul>
 */
package com.alura.user.infrastructure.persistence;
