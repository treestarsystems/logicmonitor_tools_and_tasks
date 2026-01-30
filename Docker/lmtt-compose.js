const fs = require('fs').promises;
const path = require('path');
const { execSync, spawn } = require('child_process');

class PodmanBuilder {
  constructor() {
    this.dockerDir = __dirname;
    this.buildDir = path.join(this.dockerDir, 'build');
    this.projectRoot = path.join(this.dockerDir, '..');
    this.requiredFiles = [
      // App files
      { src: '../package.json', dest: 'package.json' },
      { src: '../package-lock.json', dest: 'package-lock.json' },
      { src: '../schedule-conf.json', dest: 'schedule-conf.json' },
      { src: '../src', dest: 'src' },
      { src: '../tsconfig.json', dest: 'tsconfig.json' },
      { src: '../tsconfig.build.json', dest: 'tsconfig.build.json' },
      { src: '../nest-cli.json', dest: 'nest-cli.json' },
      // Docker files
      { src: './Dockerfile-lmtt-app', dest: 'Dockerfile-lmtt-app' },
      { src: './docker-compose.yml', dest: 'docker-compose.yml' },
      { src: './mongod.conf', dest: 'mongod.conf' },
    ];
  }

  /**
   * Logs messages with timestamps
   */
  log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const emoji = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : '📝';
    console.log(`${emoji} [${timestamp}] ${message}`);
  }

  /**
   * Executes shell commands with error handling
   */
  executeCommand(command, options = {}) {
    try {
      this.log(`Executing: ${command}`);
      const result = execSync(command, {
        stdio: 'inherit',
        cwd: this.buildDir,
        ...options,
      });
      return result;
    } catch (error) {
      this.log(`Command failed: ${command}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Copies a file or directory recursively
   */
  async copyPath(src, dest) {
    try {
      const srcPath = path.resolve(this.dockerDir, src);
      const destPath = path.resolve(this.buildDir, dest);

      // Check if source exists
      await fs.access(srcPath);

      // Get source stats
      const stats = await fs.stat(srcPath);

      if (stats.isDirectory()) {
        // Copy directory recursively
        await this.copyDirectory(srcPath, destPath);
        this.log(`Copied directory: ${src} -> ${dest}`);
      } else {
        // Copy file
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(srcPath, destPath);
        this.log(`Copied file: ${src} -> ${dest}`);
      }
    } catch (error) {
      this.log(`Failed to copy ${src}: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  /**
   * Recursively copies a directory
   */
  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Creates the build directory and copies necessary files
   */
  async prepareBuildDirectory() {
    this.log('Creating build directory...');

    // Remove existing build directory if it exists
    try {
      await fs.rm(this.buildDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist, which is fine
    }

    // Create build directory
    await fs.mkdir(this.buildDir, { recursive: true });

    // Copy all required files
    this.log('Copying required files...');
    for (const file of this.requiredFiles) {
      await this.copyPath(file.src, file.dest);
    }

    this.log('Build directory prepared successfully', 'SUCCESS');
  }

  /**
   * Checks if podman-compose is available
   */
  checkPodmanCompose() {
    try {
      execSync('podman-compose --version', { stdio: 'pipe' });
      this.log('podman-compose is available');
    } catch (error) {
      this.log('podman-compose not found. Please install it first.', 'ERROR');
      throw new Error('podman-compose is required but not installed');
    }
  }

  /**
   * Builds and starts the containers
   */
  async deployContainers() {
    this.log('Building containers with podman-compose...');

    // Build the containers
    this.executeCommand('podman-compose build');

    this.log('Starting containers...');

    // Start containers in detached mode
    this.executeCommand('podman-compose up -d');

    // Wait for containers to be healthy
    this.log('Waiting for containers to be ready...');
    await this.waitForContainers();

    this.log('Containers are up and running', 'SUCCESS');
  }

  /**
   * Waits for containers to be healthy
   */
  async waitForContainers(maxAttempts = 30, delay = 5000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const result = execSync('podman-compose ps --format json', {
          cwd: this.buildDir,
          stdio: 'pipe',
          encoding: 'utf8',
        });

        const containers = JSON.parse(result);
        const allHealthy = containers.every(
          (container) =>
            container.Status.includes('healthy') ||
            container.Status.includes('Up'),
        );

        if (allHealthy) {
          this.log('All containers are healthy');
          return;
        }

        this.log(
          `Attempt ${i + 1}/${maxAttempts}: Containers not ready yet...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (error) {
        this.log(`Health check attempt ${i + 1} failed: ${error.message}`);
        if (i === maxAttempts - 1) {
          throw new Error('Containers failed to become healthy');
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Cleans up the build directory
   */
  async cleanup() {
    try {
      this.log('Cleaning up build directory...');
      await fs.rm(this.buildDir, { recursive: true, force: true });
      this.log('Build directory removed successfully', 'SUCCESS');
    } catch (error) {
      this.log(`Failed to remove build directory: ${error.message}`, 'ERROR');
    }
  }

  /**
   * Shows container status
   */
  showStatus() {
    this.log('Container status:');
    try {
      this.executeCommand('podman-compose ps', { cwd: this.dockerDir });
    } catch (error) {
      this.log('Failed to show container status', 'ERROR');
    }
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      this.log('Starting podman-compose deployment process...');

      // Check prerequisites
      this.checkPodmanCompose();

      // Prepare build environment
      await this.prepareBuildDirectory();

      // Deploy containers
      await this.deployContainers();

      // Show final status
      this.showStatus();

      // Cleanup
      await this.cleanup();

      this.log('Deployment completed successfully! 🚀', 'SUCCESS');
    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'ERROR');

      // Attempt cleanup even on failure
      try {
        await this.cleanup();
      } catch (cleanupError) {
        this.log(`Cleanup failed: ${cleanupError.message}`, 'ERROR');
      }

      process.exit(1);
    }
  }

  /**
   * Stops and removes containers
   */
  async stop() {
    try {
      this.log('Stopping containers...');
      this.executeCommand('podman-compose down', { cwd: this.dockerDir });
      this.log('Containers stopped successfully', 'SUCCESS');
    } catch (error) {
      this.log(`Failed to stop containers: ${error.message}`, 'ERROR');
    }
  }
}

// CLI interface
if (require.main === module) {
  const builder = new PodmanBuilder();
  const command = process.argv[2];

  switch (command) {
    case 'deploy':
    case undefined:
      builder.run();
      break;
    case 'stop':
      builder.stop();
      break;
    case 'status':
      builder.showStatus();
      break;
    default:
      console.log(`
Usage: node build-and-deploy.js [command]

Commands:
  deploy (default) - Build and deploy containers
  stop            - Stop and remove containers
  status          - Show container status
      `);
      break;
  }
}

module.exports = PodmanBuilder;
