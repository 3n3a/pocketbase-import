#!/usr/bin/env node

import { program, Option } from 'commander';
import PocketBase from 'pocketbase';
import fs from "fs";
import csvParser from "csv-parser";
import 'dotenv/config'

const DEBUG = false;

/*** CLI ***/
program
	.requiredOption('-c, --collection <string>', 'must provide a collection name')
	.requiredOption('-f, --file <string>', 'must provide a file path')
	.addOption(new Option('--url <string>', 'url of pocketbase instance (with port)')
		.env('PB_URL'))
	.addOption(new Option('-u, --user <string>', 'username for pocketbase admin')
		.env('PB_USER'))
	.addOption(new Option('-p, --password <string>', 'password for pocketbase admin')
		.env('PB_PASS'));
program.parse();
const options = program.opts();
if (DEBUG) console.log(options)

/*** CONFIG ***/
const INSTANCE_URL = options.url;
const USERNAME = options.user;
const PASSWORD = options.password;

const FILE = options.file;
const COLLECTION = options.collection;

/*** MAIN ***/
const pb = new PocketBase(INSTANCE_URL);
try {
	const res = await pb.admins.authWithPassword(USERNAME, PASSWORD);
} catch(e) {
	if (DEBUG) console.log(e)
	console.log("auth with pocketbase not successful. please try again");
	process.exit();
}

async function parseCSVFile(filePath) {
  const result = [];

  let stream = null;
  try {
    stream = fs.createReadStream(filePath)
        .pipe(csvParser());
  } catch(e) {
    if (DEBUG) console.log(e)
    console.error("failed to read / find the file you specified.")
    process.exit()
  }

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

if (result.length > 0) {
	console.log("no entries in csv file")
	process.exit()
}

// create each record
let count = 0;
for (const r of result) {
	console.log("importintg record " + count++)
	try {
	const record = await pb.collection(COLLECTION).create(r);
	} catch (e) {
		console.log("record" + count + "not imported because: " + e)
	}
}
