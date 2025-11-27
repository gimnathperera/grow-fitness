#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i ":$1" > /dev/null 2>&1
}

# Function to start a service
start_service() {
    local service_name="$1"
    local service_dir="$2"
    local start_cmd="$3"
    local port="$4"
    
    echo -e "\n${BLUE}🔧 Setting up ${service_name}...${NC}"
    cd "$service_dir" || { echo -e "${RED}❌ Failed to change to ${service_dir}${NC}"; return 1; }
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "\n📦 Installing ${service_name} dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Failed to install ${service_name} dependencies${NC}"
            return 1
        fi
    fi
    
    # Check if port is already in use
    if port_in_use "$port"; then
        echo -e "${YELLOW}⚠️  Port ${port} is already in use. ${service_name} might already be running.${NC}"
        return 0
    fi
    
    # Start the service
    echo -e "\n🚀 Starting ${service_name} server on port ${port}..."
    if [ "$service_name" = "Client" ]; then
        # Client uses Vite which doesn't support --port flag directly
        VITE_API_BASE_URL=http://localhost:4000 npm run dev -- --port $port &
    else
        npm run $start_cmd &
    fi
    local pid=$!
    
    # Store the PID
    eval "${service_name}_PID=$pid"
    echo -e "${GREEN}✅ ${service_name} server started (PID: $pid)${NC}"
    
    # Go back to project root
    cd ..
    return 0
}

# Main script
echo -e "${YELLOW}🚀 Starting Grow Fitness Application...${NC}"

# Check for required software
echo -e "\n🔍 Checking system requirements..."

# Check Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ and try again.${NC}
   Visit: https://nodejs.org/"
    exit 1
fi

# Check npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm and try again.${NC}"
    exit 1
fi

# Check MongoDB (only for API)
if ! command_exists mongod; then
    echo -e "${YELLOW}⚠️  MongoDB is not running or not installed. The API will not work without MongoDB.${NC}"
    read -p "Do you want to continue without MongoDB? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Your Node.js version is below 18. Some features might not work as expected.${NC}"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for required environment files
if [ ! -f "api/.env" ]; then
    echo -e "\n⚙️  Creating .env file for API..."
    if [ -f "api/.env.example" ]; then
        cp api/.env.example api/.env
        echo -e "${YELLOW}ℹ️  Please update api/.env with your configuration.${NC}"
    else
        echo -e "${RED}❌ api/.env.example not found. Please create api/.env with the required configuration.${NC}"
        exit 1
    fi
fi

if [ ! -f "client/.env" ]; then
    echo -e "\n⚙️  Creating .env file for Client..."
    echo "VITE_API_BASE_URL=http://localhost:4000" > client/.env
fi

if [ ! -f "admin/.env.local" ]; then
    echo -e "\n⚙️  Creating .env.local file for Admin..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > admin/.env.local
fi

# Start API
start_service "API" "api" "start:dev" "4000" || exit 1

# Start Admin Panel
start_service "Admin" "admin" "dev" "3000" || { kill $API_PID 2>/dev/null; exit 1; }

# Start Client
start_service "Client" "client" "dev" "5173" || { kill $API_PID $ADMIN_PID 2>/dev/null; exit 1; }

# Handle script termination
cleanup() {
    echo -e "\n${RED}🛑 Shutting down all services...${NC}"
    kill $API_PID $ADMIN_PID $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT

echo -e "\n${GREEN}🎉 Grow Fitness Application is now running!${NC}"
echo -e "   - Client: ${GREEN}http://localhost:5173${NC}"
echo -e "   - Admin Panel: ${GREEN}http://localhost:3000${NC}"
echo -e "   - API: ${GREEN}http://localhost:4000${NC}"

echo -e "\n👤 Default Admin Login:"
echo -e "   - Email: ${YELLOW}admin@growfitness.lk${NC}"
echo -e "   - Password: ${YELLOW}admin123${NC}"

echo -e "\n🔌 API Endpoints:"
echo -e "   - Base URL: ${YELLOW}http://localhost:4000${NC}"
echo -e "   - API Docs: ${YELLOW}http://localhost:4000/api${NC}"

echo -e "\n${YELLOW}🛑 Press Ctrl+C to stop all services${NC}"

# Wait for all processes
wait $API_PID $ADMIN_PID $CLIENT_PID
