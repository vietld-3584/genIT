#!/bin/bash

# Setup PostgreSQL database for development
# Run this script to create database and user

set -e

DB_NAME="myapp_db"
DB_USER="myapp_user" 
DB_PASS="myapp_password"

echo "🔧 Setting up PostgreSQL database for development..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service first."
    echo "   Ubuntu/Debian: sudo systemctl start postgresql"
    echo "   macOS: brew services start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create user and database
echo "📝 Creating database user and database..."

sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
    EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE 'User ${DB_USER} already exists';
END\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Connect to the database and grant schema privileges
\c ${DB_NAME}
GRANT ALL ON SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};

\q
EOF

echo "✅ Database setup completed!"
echo ""
echo "📊 Database connection details:"
echo "   Host: localhost"
echo "   Port: 5432" 
echo "   Database: ${DB_NAME}"
echo "   User: ${DB_USER}"
echo "   Password: ${DB_PASS}"
echo ""
echo "🔥 Next steps:"
echo "   1. Make sure .env.local contains the correct database credentials"
echo "   2. Run: npx mikro-orm migration:create --initial"
echo "   3. Run: npx mikro-orm migration:up"
echo "   4. Run: npx tsx lib/db/seed/seed.ts"
