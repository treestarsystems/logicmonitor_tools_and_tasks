const fs = require('fs');

/**
 * @description Checks if a string contains special characters that require quoting
 * @param {string} value - The value to check
 * @returns {boolean} - True if the value contains special characters
 */
function needsQuoting(value) {
  // Check for special characters commonly found in URLs, emails, etc.
  const specialChars = /[\/\:\@\.\-\s\#\$\&\?\=\%\+]/;
  return specialChars.test(value);
}

/**
 * @description Encapsulates a value with single quotes if it contains special characters
 * @param {string} value - The value to potentially quote
 * @returns {string} - The value, optionally wrapped in single quotes
 */
function encapsulateValue(value) {
  // Skip if already quoted
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value;
  }

  // Add single quotes if value contains special characters
  if (needsQuoting(value)) {
    return `'${value}'`;
  }

  return value;
}

/**
 * @description Parses a .env file and returns key-value pairs
 * @param {string} envFilePath - Path to the .env file
 * @returns {Object} - Object containing environment variables
 */
function parseEnvFile(envFilePath) {
  const envVars = {};

  try {
    const envContent = fs.readFileSync(envFilePath, 'utf8');
    const lines = envContent.split('\n');

    lines.forEach((line) => {
      // Skip empty lines and comments
      if (line.trim() === '' || line.trim().startsWith('#')) {
        return;
      }

      // Parse key=value pairs
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        let value = line.substring(equalIndex + 1).trim();

        // Remove existing quotes to normalize
        if (
          (value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))
        ) {
          value = value.slice(1, -1);
        }

        // Encapsulate with single quotes if needed
        const processedValue = encapsulateValue(value);
        envVars[key] = processedValue;
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return {};
  }
}

/**
 * @description Replaces $VARIABLE placeholders with actual values from environment variables
 * @param {string} content - Template content
 * @param {Object} envVars - Environment variables object
 * @returns {string} - Content with replaced variables
 */
function replaceVariables(content, envVars) {
  return content.replace(/\$([A-Z_][A-Z0-9_]*)/g, (match, varName) => {
    if (envVars.hasOwnProperty(varName)) {
      return envVars[varName];
    } else {
      console.warn(
        `Warning: Environment variable ${varName} not found in .env file`,
      );
      return match; // Keep original placeholder if not found
    }
  });
}

/**
 * @description Main function to generate docker-compose.yml from template
 */
function generateDockerCompose() {
  const templatePath = './docker-compose.yml-template';
  const envPath = '../.env';
  const outputPath = './docker-compose.yml';

  try {
    // Read template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Parse .env file
    const envVars = parseEnvFile(envPath);

    // Show which values were quoted
    console.log('🔧 Processing environment variables');

    // Replace variables in template
    const processedContent = replaceVariables(templateContent, envVars);

    // Write output file
    fs.writeFileSync(outputPath, processedContent, 'utf8');

    console.log('✅ docker-compose.yml generated successfully!');
    console.log(`📁 Output file: ${outputPath}`);
    console.log(`🔧 Variables replaced: ${Object.keys(envVars).length}`);
  } catch (error) {
    console.error('❌ Error generating docker-compose.yml:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateDockerCompose();
}

module.exports = {
  parseEnvFile,
  replaceVariables,
  generateDockerCompose,
  encapsulateValue,
  needsQuoting,
};
