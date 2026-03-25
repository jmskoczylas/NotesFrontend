FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY NotesMicroservice/src/Application/Application.csproj NotesMicroservice/src/Application/
COPY NotesMicroservice/src/Domain/Domain.csproj NotesMicroservice/src/Domain/
COPY NotesMicroservice/src/Infrastructure/Infrastructure.csproj NotesMicroservice/src/Infrastructure/
RUN dotnet restore NotesMicroservice/src/Application/Application.csproj

COPY NotesMicroservice/. NotesMicroservice/
RUN dotnet publish NotesMicroservice/src/Application/Application.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends sqlite3 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
COPY --from=build /src/NotesMicroservice/src/Application/database ./database
COPY NotesFrontend/docker/notes-api-entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh \
    && chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["sh", "/entrypoint.sh"]
