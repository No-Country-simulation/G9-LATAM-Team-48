"""
Importa 03_feature_engineering.csv sin LOAD DATA LOCAL (MySQL remoto / OCI).
Requiere: pip install pymysql
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
import unicodedata

try:
    import pymysql
except ImportError:
    print("Falta pymysql. Ejecuta: pip install pymysql", file=sys.stderr)
    sys.exit(1)


def normalize_col(name: str) -> str:
    nfd = unicodedata.normalize("NFD", name)
    ascii_chars = "".join(
        c for c in nfd if unicodedata.category(c) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", "_", ascii_chars.lower()).strip("_")


def empty_to_none(value: str | None):
    if value is None or value == "":
        return None
    return value


def main() -> int:
    parser = argparse.ArgumentParser(description="Import FE CSV to dataset_feature_engineering")
    parser.add_argument("--csv", required=True, help="Path to 03_feature_engineering.csv")
    parser.add_argument("--host", required=True)
    parser.add_argument("--port", type=int, default=3306)
    parser.add_argument("--user", required=True)
    parser.add_argument("--password", default="")
    parser.add_argument("--database", required=True)
    parser.add_argument("--batch-size", type=int, default=500)
    parser.add_argument(
        "--replace",
        action="store_true",
        help="TRUNCATE table before import (ignores existing rows check)",
    )
    args = parser.parse_args()

    with open(args.csv, newline="", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        header = next(reader)
    columns = [normalize_col(h) for h in header]
    if len(columns) != 238:
        print(f"El CSV debe tener 238 columnas; hay {len(columns)}.", file=sys.stderr)
        return 1
    if len(set(columns)) != len(columns):
        print("Encabezados duplicados tras normalizar.", file=sys.stderr)
        return 1

    col_sql = ", ".join(f"`{c}`" for c in columns)
    placeholders = ", ".join(["%s"] * len(columns))
    insert_sql = (
        f"INSERT INTO dataset_feature_engineering ({col_sql}) VALUES ({placeholders})"
    )

    conn = pymysql.connect(
        host=args.host,
        port=args.port,
        user=args.user,
        password=args.password,
        database=args.database,
        charset="utf8mb4",
        connect_timeout=120,
        read_timeout=3600,
        write_timeout=3600,
        autocommit=False,
    )

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM dataset_feature_engineering")
            (count,) = cur.fetchone()
            if count and count > 0:
                if not args.replace:
                    print(
                        f"La tabla ya tiene {count} registros. "
                        "Usa --replace o TRUNCATE antes.",
                        file=sys.stderr,
                    )
                    return 1
                cur.execute("TRUNCATE TABLE dataset_feature_engineering")
                conn.commit()
                print("Tabla truncada.")

            total = 0
            batch: list[tuple] = []
            with open(args.csv, newline="", encoding="utf-8-sig") as f:
                reader = csv.reader(f)
                next(reader)
                for row in reader:
                    if len(row) != len(columns):
                        continue
                    batch.append(tuple(empty_to_none(v) for v in row))
                    if len(batch) >= args.batch_size:
                        cur.executemany(insert_sql, batch)
                        conn.commit()
                        total += len(batch)
                        print(f"Insertadas {total} filas...", flush=True)
                        batch.clear()
                if batch:
                    cur.executemany(insert_sql, batch)
                    conn.commit()
                    total += len(batch)
                    print(f"Insertadas {total} filas...", flush=True)

            cur.execute("SELECT COUNT(*) FROM dataset_feature_engineering")
            (final,) = cur.fetchone()
            print(f"dataset_rows={final}")
    finally:
        conn.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
