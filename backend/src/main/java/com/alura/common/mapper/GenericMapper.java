package com.alura.common.mapper;

/**
 * Contrato base para el mapeo bidireccional entre entidades de dominio y DTOs.
 *
 * <p>Ofrece una firma comun para los mappers de cada modulo, favoreciendo la
 * consistencia. Las implementaciones podran ser manuales o generadas
 * (por ejemplo, MapStruct) en el futuro.</p>
 *
 * @param <E> tipo de la entidad de dominio
 * @param <D> tipo del DTO
 */
public interface GenericMapper<E, D> {

    D toDto(E entity);

    E toEntity(D dto);
}
