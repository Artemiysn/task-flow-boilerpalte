.PHONY: up down logs ps clean

up:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

down:
	docker-compose down

logs:
	docker-compose logs -f

ps:
	docker-compose ps

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Для продакшена
prod-up:
	docker-compose -f docker-compose.yml up --build -d