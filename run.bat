
echo Starting the application...

@echo off
@REM=====================================================
@REM Run the Docker container and start the backend and frontend servers 
@REM=============================================================

docker-compose up --build >> docker.log

cd kim_chat_backend
start "" cmd /c "npm run dev > backend.log 2>&1"

cd ..

cd kim_chat_frontend
start "" cmd /c "npm run dev > frontend.log 2>&1"

cd ..