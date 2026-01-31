# Deployment Scripts for LogicMonitor Tools and Tasks

This project provides a set of scripts for managing the deployment of your Docker or Podman containers. The `package.json` scripts allow you to generate a `docker-compose.yml` file, deploy containers, stop them, or check their status. These scripts are primarily designed to work within the `Docker/` directory of your project.

---

## **Scripts Overview**

### **1. Deploy Containers**

```bash
npm run deploy
```

- **Description**: Deploys the containers using the `compose-deploy.sh` script.
- **What It Does**:
  - Navigates to the `Docker/` directory.
  - Ensures the required build and runtime files are prepared.
  - Starts the services defined in the `docker-compose.yml` file.

---

### **2. Generate `docker-compose.yml` File**

```bash
npm run deploy:gen
```

- **Description**: Generates the `docker-compose.yml` file from the template and `.env` variables using `compose-generate.sh`.
- **What It Does**:
  - Navigates to the `Docker/` directory.
  - Reads the `docker-compose.yml-template` file.
  - Replaces placeholders with values from the `.env` file.
  - Creates or overwrites the `docker-compose.yml` file with the updated values.

---

### **3. Stop Containers**

```bash
npm run deploy:stop
```

- **Description**: Stops and removes all deployed containers.
- **What It Does**:
  - Navigates to the `Docker/` directory.
  - Executes the `compose-deploy.sh` script with the `stop` argument to cleanly stop and remove all running containers.

---

### **4. Get Container Status**

```bash
npm run deploy:status
```

- **Description**: Displays the status of the deployed containers.
- **What It Does**:
  - Navigates to the `Docker/` directory.
  - Executes the `compose-deploy.sh` script with the `status` argument to list all running or stopped containers.

---

## **Script Details**

### **Script: `compose-deploy.sh`**

This script is used for managing container deployments. It accepts the following commands:

- `deploy`: Builds and starts the containers.
- `stop`: Stops and removes the containers.
- `status`: Displays the status of the containers.

---

### **Script: `compose-generate.sh`**

This script is used for generating the `docker-compose.yml` file:

- It processes the `docker-compose.yml-template` file.
- Replaces placeholders in the template with corresponding values from the `.env` file.

---

## **Usage**

### **1. Deploy Your Containers**

To build and run your containers:

```bash
npm run deploy
```

### **2. Generate the `docker-compose.yml` File**

To regenerate the `docker-compose.yml` file from your template:

```bash
npm run deploy:gen
```

### **3. Stop Running Containers**

To stop and clean up the running containers:

```bash
npm run deploy:stop
```

### **4. Check the Status of Containers**

To view the current status of all containers:

```bash
npm run deploy:status
```

---

## **Prerequisites**

Before using these scripts, make sure the following prerequisites are met:

1. **Docker or Podman Installed**:
   - Ensure Docker or Podman is installed on your machine.
2. **Correct Directory Structure**:
   - The `Docker` folder must exist at the root of your repository.
3. **Template File**:
   - The `Docker/docker-compose.yml-template` file should define placeholders (e.g., `$VARIABLE`) to populate the `docker-compose.yml` file dynamically.
4. **`.env` File**:
   - The `.env` file (located in the project root directory) must contain key-value pairs for the variables used in the template.
5. **Execute Permissions**:
   - Ensure the `compose-deploy.sh` and `compose-generate.sh` scripts have execute permission:
     ```bash
     chmod +x Docker/compose-deploy.sh Docker/compose-generate.sh
     ```

---

## **Example Workflow**

1. **Generate the `docker-compose.yml` File**:

   ```bash
   npm run deploy:gen
   ```

2. **Deploy and Start Containers**:

   ```bash
   npm run deploy
   ```

3. **Check Container Status**:

   ```bash
   npm run deploy:status
   ```

4. **Stop and Remove Containers**:
   ```bash
   npm run deploy:stop
   ```

---

## **File Structure**

Ensure the following files and directories exist in your project:

```plaintext
project-root/
├── Docker/
│   ├── docker-compose.yml-template   # Template file for generating docker-compose.yml
│   ├── compose-deploy.sh             # Script to deploy, stop, and check containers
│   ├── compose-generate.sh           # Script to generate docker-compose.yml
├── .env                              # Environment variables file
├── package.json                      # Contains the npm scripts
```

---

## **Configuration Example**

### **Sample `.env` File**

Define the environment-specific variables in the `.env` file:

```env
APP_NAME=LogicMonitorApp
APP_PORT=3000
DB_HOST=db
DB_PORT=27017
```

### **Sample `docker-compose.yml-template` File**

The template file should use placeholders for environment variables:

```yaml
version: '3.9'
services:
  app:
    image: $APP_NAME
    ports:
      - '$APP_PORT:3000'
    environment:
      - DB_HOST=$DB_HOST
      - DB_PORT=$DB_PORT
```

---

## **Conclusion**

These scripts simplify the process of managing Docker or Podman containers for your project. By leveraging `docker-compose.yml` templates and environment variables, you can automate and standardize your deployment workflow.
