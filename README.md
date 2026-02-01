# LogicMonitor Tools and Tasks

> **A custom application for tools and tasks that use the LogicMonitor platform.**

This repository contains a TypeScript-based using the [NestJS](https://github.com/nestjs/nest)
framework. This application provides tools and functionalities leveraging the LogicMonitor platform.
The application is designed to simplify operations, automate tasks, and improve efficiency for
LogicMonitor users.

---

## **Table of Contents**

- [API Documentation](#api-documentation)
  - [Swagger](#swagger)
  - [TypeDoc](#typedoc)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Commands](#commands)
- [Deployment](#deployment)
  - [Deploying with Docker/Podman](#deploying-with-dockerpodman)
  - [Stopping Containers](#stopping-containers)
  - [Checking Container Status](#checking-container-status)
- [Contributing](#contributing)
- [License](#license)

---

## **API Documentation**

### **Swagger**

API: http://localhost:3000/api/v1/docs

### **TypeDoc**

Code: http://localhost:3000/code/docs

---

## **Features**

- Automates tasks and provides tools that integrate with LogicMonitor APIs.
- Extensible architecture implemented in **TypeScript** (98.9% of the codebase).
- Configuration-driven approach using environment variables for flexibility.
- Docker and Podman support for containerized deployment.

---

## **Project Structure**

```plaintext
logicmonitor_tools_and_tasks/
├── src/                             # Source code for the main application
├── Docker/                          # Docker and Podman configuration files
│   ├── docker-compose.yml-template
│   ├── compose-deploy.sh            # Script to deploy, stop, and check containers
│   ├── compose-generate.sh          # Script to generate docker-compose.yml
│   ├── mongod.conf                  # Custom MongoDB configuration
├── test/                            # Unit and integration tests
├── .env                             # Define environment variables
├── package.json                     # Node.js package file with scripts
├── tsconfig.json                    # TypeScript configuration file
├── README.md                        # Project README (this file)
└── ...
```

---

## **Getting Started**

### **Prerequisites**

Before running or deploying the application, ensure you have the following dependencies installed:

1. **Node.js** (v24.13.0 LTS)
2. **npm or yarn** (Node Package Manager)
3. **Docker or Podman** (for containerized deployment)

---

### **Environment Setup**

1. **Configure container hosts**:

   ```bash
   sudo apt update
   sudo apt install -y net-tools iputils-ping nano git screen podman podman-docker podman-compose python3-setuptools jq
   echo -e "unqualified-search-registries = ["docker.io"]\n" >> /etc/containers/registries.conf
   sudo systemctl --user start podman.socket
   sudo systemctl --user enable podman.socket
   sudo mkdir -p /opt/lmtt/{db,app}
   sudo chmod 777 -R /opt/lmtt/*
   ```

2. **Create a `.env` File**: The application relies on environment variables for initial app
   configuration. Create a `.env` file by copying the included template `.env-rename` in the root
   directory and configure the necessary variables.

   Example `.env`:

   ```env
   APP_PORT=3000
   MONGODB_HOSTNAME=localhost
   MONGODB_PORT=27017
   MONGODB_NAME=lmtt
   MONGODB_USERNAME=admin
   MONGODB_PASSWORD=password
   SWAGGER_COMPANY_NAME='Company Name'
   SWAGGER_COMPANY_SITE='https://www.company.com'
   SWAGGER_COMPANY_EMAIL='info@example.com'
   SCHEDULES_CONF_FILE_NAME='schedule-conf.json'
   ```

3. **Configure the `schedule-conf.json` File**: The application uses a file (`schedule-conf.json`)
   to store critical configuration information like company details, access credentials, and group
   names. This file is necessary for scheduling tasks that integrate with the LogicMonitor platform.
   - The file is located in the root directory.
   - Use the provided `schedule-conf.json-rename` as a template.
   - Copy the `schedule-conf.json-rename` file to `schedule-conf.json`:

     ```bash
     cp schedule-conf.json-rename schedule-conf.json
     ```

   - Update the fields in the file with your credentials:

     ```json
     [
       {
         "company": "your-company-name-here",
         "accessId": "your-access-id-here",
         "accessKey": "your-access-key-here",
         "groupName": "your-group-name-here"
       },
       {
         "company": "another-company",
         "accessId": "another-access-id",
         "accessKey": "another-access-key",
         "groupName": "another-group-name"
       }
     ]
     ```

     - **`company`**: The name of the company.
     - **`accessId`**: LogicMonitor API Access ID.
     - **`accessKey`**: LogicMonitor API Access Key.
     - **`groupName`**: Name of the group associated with the schedule.

   Ensure this file is properly configured before running the application.

4. **Generate `docker-compose.yml`**: Use the template to generate a `docker-compose.yml` file. This
   step will populate placeholders in the template with values from the `.env` file.

   Run:

   ```bash
   npm run deploy:gen
   ```

---

### **Commands**

Here are some commonly used commands available in the `package.json` file:

| Command                 | Description                                |
| ----------------------- | ------------------------------------------ |
| `npm run start`         | Starts the application.                    |
| `npm run start:dev`     | Starts the app in development mode.        |
| `npm run start:prod`    | Starts the app in production mode.         |
| `npm run build`         | Builds the TypeScript code.                |
| `npm run test`          | Runs all tests.                            |
| `npm run deploy`        | Deploys the app using Docker/Podman.       |
| `npm run deploy:gen`    | Generates `docker-compose.yml`.            |
| `npm run deploy:stop`   | Stops all running containers.              |
| `npm run deploy:status` | Displays the status of running containers. |

---

## **Deployment**

The application can be deployed using Docker or Podman. The process uses scripts within the `Docker`
directory for containerized management.

### **Deploying with Docker/Podman**

1. **Deploy Containers**: Deploy the application by running:
   ```bash
   npm run deploy
   ```
   This script builds and starts the containers as defined in the `docker-compose.yml` file.

---

### **Stopping Containers**

To stop running containers, use the following command:

```bash
npm run deploy:stop
```

This command stops and removes all deployed containers.

---

### **Checking App Deployment Status**

To check the status of all containers, use:

```bash
npm run deploy:status
```

This will display a list of running and stopped containers, along with their details.

---

## **Contributors**

Author - [Michael of Tree Star Systems](mailto:aoe4eva@gmail.com)

---

## **Support**

...what is that?

---

## **License**

NestJS is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute
this software following the terms of the license.

---
