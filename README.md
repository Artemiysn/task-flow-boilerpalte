init

.env example:

```
# PostgreSQL
DATABASE_URL=postgres://postgres:postgres_12344@localhost:5432/taskflow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_12344
POSTGRES_DB=taskflow
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_DEFAULT_USER=taskflow-1
RABBITMQ_DEFAULT_PASS=taskflow-1
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672

JWT_SECRET=w/ERD8KZtpeH
JWT_EXPIRES_IN=24h

```

Для запуска

```
make up
# или
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
````

localhost:3000 - открыт (это сервис API)

дальше поднять миграции

Notes
======

Для миграций нужно ясно указать переменную DATABASE_URL

в linux: 

export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp"

ЛИБО указать явно путь к .env файлу (как в package.json)


пакеты нужно устанавливать в 2-ух местах пока что: локально и в контейнере (подумать как исправить)
