#!/bin/sh
set -e

echo "🚀 Starting cleareq application..."


if [ -z "$SERVER_PORT" ]; then
    SERVER_PORT="8090"
fi

echo "📋 Configuration:"
echo "   Port: $SERVER_PORT"
echo "   JAVA_OPTS: $JAVA_OPTS"

# Start Nginx in background
echo "📡 Starting Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait for Nginx to start
sleep 2

# Start Spring Boot
echo "🔧 Starting Spring Boot..."
exec java $JAVA_OPTS -jar /app/app.jar \
    --server.port=$SERVER_PORT

# Cleanup on exit
trap "kill $NGINX_PID 2>/dev/null" EXIT
