

---

## Prerequisites
Before beginning the fresh setup, ensure you have the following installed on your local machine:
* **Node.js** (v18 or higher recommended)
* **Docker** & **Docker Compose** ( for Db mainly)
* **npm** or **yarn**

---

## Backend Setup

The backend handles the core REST API endpoints and the Peer server connections, utilizing Prisma as the ORM and Schema Registry connected to a containerized PostgreSQL database.

### 1. Database Setup (PostgreSQL via Docker)
We use Docker to spin up an isolated, easily reproducible PostgreSQL instance. 

You can find a docker file in this repo named `docker-compose.yml` which is containg code for postgreSQL setup
make required chages if needed


**Run the container in detached mode:**
```bash
docker-compose up -d
```

### 2. Environment Variables
Create a `.env` file in the root directory to configure your database and server ports:
```env
# Connects to the Docker PostgreSQL instance
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/maindb"

# Server Ports
PORT=3000
JWT_SECRET="your-jwt-sectret"
```

### 3. Prisma & Schema Registry Setup
Navigate into your backend folder, install dependencies, and initialize Prisma.

```bash
cd vigility-Be
npm install
```

```bash
#  Push the schema to your database
npx prisma db push

```




### 4. Running the Servers (REST & Peer)
The backend requires starting both the HTTP REST routes and the Peer connection server. 

```bash
# generate dummy 50 data in the backend 
npm run seed

# Start the backend development server
npm run dev
```
* **REST API:** Running on `http://localhost:3000`

### 5. Stack/architectural choices 
* **PostgreSQL:**  chooseing PostgreSQL over Mysql because of better to mange with powerful query (NoSQL  will be better for scaling)  
* **Node.js + Express:** Industry standard and lightwaight and for this senario it's perfect (Alternative- nest.js if the logic will be too complex)
* **Prisma:** again instrustry standard and eaasy to setup and use (gives us a extra layer of security )

```bash
# generate dummy 50 data in the backend 
npm run seed

# Start the backend development server
npm run dev
```
* **REST API:** Running on `http://localhost:3000`


### 5. Scaling to 1 Million Writes/Minute

At 1 million writes per minute (~16,600 requests per second), writing directly to a PostgreSQL database on every /track API call would rapidly exhaust connection pools, cause severe locking contention, and ultimately crash the database.

* fist and most important deploying the backend in AWS EC to utilize AWS features for scaling.
* I will decouple the ingestion and storage layers using an Event Stream like  Kafka or AWS Kinesis.
* I will do the write process in db in a batch so that it won't overload the db 
* I will implement Redis caching to decrese the load on db from get apis
* we can even do database sharding as we can't horizantally scale a db we can decrese the size by sharding it
* we can use Read replica db method to decrese the load in the main db where the write actions will happen 

---