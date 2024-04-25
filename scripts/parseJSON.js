const fs = require("fs");
const path = require("path");

// Define the paths for the input and output files relative to the script's directory
const inputFilePath = path.join(__dirname, "temp", "json.txt");
const outputFilePath = path.join(__dirname, "temp", "json.json");

// Function to recursively parse all stringified JSON within an object
function recursivelyParseJSON(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      try {
        // Try to parse every string as JSON first
        const parsedJson = JSON.parse(obj[key]);
        obj[key] = parsedJson; // Replace the original string with parsed JSON
        recursivelyParseJSON(obj[key]); // Further parse the newly parsed JSON
      } catch (e) {
        // If parsing fails, check for a prefixed scenario
        const match = obj[key].match(/^(.*?):\s*({|\[)/);
        if (match) {
          const prefix = match[1].trim();
          const jsonString = obj[key].substring(
            match[0].length - match[2].length
          );
          try {
            const parsedJson = JSON.parse(jsonString);
            obj[key] = { [prefix]: parsedJson }; // Use prefix as the new key for the parsed JSON
            recursivelyParseJSON(obj[key]); // Recursively parse the new structure
          } catch (parseError) {
            // If secondary parse fails, do nothing, the content remains a string
          }
        }
      }
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      recursivelyParseJSON(obj[key]);
    }
  }
}

// Read the content from 'json.txt'
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Parse the content to JSON
  try {
    let jsonContent = JSON.parse(data);
    recursivelyParseJSON(jsonContent);

    // Convert JSON object back to string for saving
    const jsonString = JSON.stringify(jsonContent, null, 2);

    // Write the JSON string to a new file 'json.json'
    fs.writeFile(outputFilePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        return;
      }
      console.log("JSON file has been saved.");
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});
