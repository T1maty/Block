#!/bin/bash
./scripts/wait-for-db.sh db 5432
uvicorn app.main:app --host 0.0.0.0 --port 7000 --workers 4