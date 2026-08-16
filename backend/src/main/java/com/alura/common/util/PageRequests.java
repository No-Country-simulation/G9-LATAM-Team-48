package com.alura.common.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Normaliza parametros de paginacion de query params.
 */
public final class PageRequests {

    public static final int DEFAULT_SIZE = 15;
    public static final int MAX_SIZE = 100;

    private PageRequests() {}

    public static Pageable of(int page, int size, Sort sort) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(MAX_SIZE, Math.max(1, size));
        if (sort == null || sort.isUnsorted()) {
            return PageRequest.of(safePage, safeSize);
        }
        return PageRequest.of(safePage, safeSize, sort);
    }
}
