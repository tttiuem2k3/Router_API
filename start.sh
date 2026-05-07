docker stop ttt_router
docker rm ttt_router
docker build -t ttt_router .
docker run -d --name ttt_router -p 20128:20128 --env-file .env -v ttt_router-data:/app/data ttt_router
