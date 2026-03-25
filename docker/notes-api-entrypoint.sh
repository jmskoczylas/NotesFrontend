#!/bin/sh
set -eu

db_provider="${Db__Provider:-Sqlite}"
connection_string="${ConnectionStrings__Default:-}"

if [ "$db_provider" = "Sqlite" ] && [ -n "$connection_string" ]; then
  db_path="${connection_string#Data Source=}"
  db_dir="$(dirname "$db_path")"

  mkdir -p "$db_dir"

  if [ ! -f "$db_path" ]; then
    sqlite3 "$db_path" < /app/database/schema.sqlite.sql
  fi
fi

exec dotnet Application.dll
