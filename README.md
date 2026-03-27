

---

## Prerequisites
Before beginning the fresh setup, ensure you have the following installed on your local machine:
* **Node.js** (v18 or higher recommended)
* **Docker** & **Docker Compose**
* **npm** or **yarn**

---

## Backend Setup

The backend handles the core REST API endpoints and the Peer server connections, utilizing Prisma as the ORM and Schema Registry connected to a containerized PostgreSQL database.

### 1. Database Setup (PostgreSQL via Docker)
We use Docker to spin up an isolated, easily reproducible PostgreSQL instance. 

Create a `docker-compose.yml` file in your root or `backend/` directory:
```
```text?code_stderr&code_event_index=2
Traceback (most recent call last):
  File "<string>", line 119, in <module>
FileNotFoundError: [Errno 2] No such file or directory: '/mnt/data/README.md'

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: pg_database
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: adminpassword
      POSTGRES_DB: maindb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Run the container in detached mode:**
```bash
docker-compose up -d
```
> **Pro-Tip:** You can use the docker commands from the previous setup to completely wipe this volume if you ever need to reset the database from scratch.

### 2. Environment Variables
Create a `.env` file in the `backend/` directory to configure your database and server ports:
```env
# Connects to the Docker PostgreSQL instance
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/maindb?schema=public"

# Server Ports
PORT=8000
PEER_PORT=9000
```

### 3. Prisma & Schema Registry Setup
Navigate into your backend folder, install dependencies, and initialize Prisma.

```bash
cd backend
npm install
npx prisma init
```

This will generate a `prisma/schema.prisma` file. Define your models in this registry. Once your schema is prepared, synchronize it with the Dockerized PostgreSQL database:

```bash
# 1. Create a migration history and apply it to the database
npx prisma migrate dev --name init

# 2. Generate the Prisma Client to interact with the DB in your code
npx prisma generate
```

### 4. Running the Servers (REST & Peer)
The backend requires starting both the HTTP REST routes and the Peer connection server. 

```bash
# Start the backend development server
npm run dev
```
* **REST API:** Running on `http://localhost:8000`
* **Peer Server:** Running on `http://localhost:9000`

---

## Frontend Setup