#!/bin/bash

# Start backend
echo "Starting backend..."
cd backend
pnpm exec tsx server.ts &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../frontend
pnpm exec next dev &
FRONTEND_PID=$!

echo "Servers started. Frontend: http://localhost:3000, Backend: http://localhost:4000"
echo "Press Ctrl+C to stop."

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
