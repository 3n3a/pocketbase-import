import PocketBase from 'pocketbase';
import fs from "fs";
import csvParser from "csv-parser";

/*** CONFIG ***/
const INSTANCE_URL = "http://100.125.192.24:8081";
const USERNAME = "admin@enea.tech";
const PASSWORD = "r8EmVAgM0JUmd4";

const FILE = "./countries_sources.csv" // "./location_all_countries.csv";
const COLLECTION = "sources" // "countries";

/*** MAIN ***/
const pb = new PocketBase(INSTANCE_URL);
await pb.admins.authWithPassword(USERNAME, PASSWORD);

async function parseCSVFile(filePath) {
  const result = [];

  const stream = fs.createReadStream(filePath)
    .pipe(csvParser());

  // Wrap stream events in a Promise
  const onData = () => {
    return new Promise((resolve, reject) => {
      stream.on('data', (data) => {
        result.push(data);
      });
      stream.on('end', () => {
        resolve(result); // Resolve with the result array
      });
      stream.on('error', (error) => {
        reject(error);
      });
    });
  };

  try {
    return await onData(); // Return the result array
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return []; // Return an empty array in case of error
  }
}

// read csv
let result = await parseCSVFile(FILE);

// create each record
for (const r of result) {
	console.log("import record")
	try {
	const record = await pb.collection(COLLECTION).create(r);
	} catch (e) {
		console.log("not imported because: " + e)
	}
}
