FRONTEND_DIR = frontend
BACKEND_DIR = backend

.PHONY: run-frontend
run-frontend:
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: run-backend
run-backend:
	cd $(BACKEND_DIR) && source venv/bin/activate && uvicorn main:app --reload

.PHONY: run
run:
	@echo "Starting frontend and backend..."
	
	(cd $(FRONTEND_DIR) && npm run dev 2>&1 | sed 's/^/[FRONTEND] /' &); \
	(cd $(BACKEND_DIR) && source venv/bin/activate && uvicorn main:app --reload 2>&1 | sed 's/^/[BACKEND] /' &); \
	wait

.PHONY: stop
stop:
	@echo "Stopping all servers..."
	lsof -ti:3000 | xargs kill -9 && lsof -ti:8000 | xargs kill -9
	@echo "All servers stopped"

