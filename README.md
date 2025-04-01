# PocketBase CSV Importer

A command-line tool to import CSV data into a specified collection in a PocketBase instance.

## Features
- Authenticate with PocketBase using admin credentials
- Read CSV files and import records into a specified collection
- Supports environment variables for configuration
- Handles errors and logs progress during import

## Installation

Ensure you have Node.js installed, then install the package globally:

```sh
npm install -g pocketbase-import
```

## Usage

```sh
pocketbase-import -c <collection> -f <file> --url <pocketbase_url> -u <username> -p <password>
```

### Required Options:
- `-c, --collection <string>`: The name of the PocketBase collection to import into.
- `-f, --file <string>`: The path to the CSV file to import.

### Optional Environment Variables:
Instead of passing credentials via command line arguments, you can use environment variables:

- `PB_URL`: PocketBase instance URL (including port if necessary)
- `PB_USER`: PocketBase admin username
- `PB_PASS`: PocketBase admin password

Example using environment variables:

```sh
PB_URL="http://127.0.0.1:8090" PB_USER="admin@example.com" PB_PASS="securepassword" pocketbase-import -c users -f data.csv
```

## Example

```sh
pocketbase-import -c users -f users.csv --url http://127.0.0.1:8090 -u admin@example.com -p mypassword
```

## Error Handling
- If authentication fails, the script will exit with an error.
- If the CSV file is not found or cannot be read, an error message is displayed.
- If the specified collection does not exist, the script will terminate.
- Any failed record imports will be logged with the error message.

## Debug Mode
Enable debugging by setting `DEBUG=true` in the script or modifying the `DEBUG` constant in the source code.

## License
MIT License

## Contributions
Feel free to open an issue or submit a pull request if you find any bugs or want to add features!

---

Made with ❤️ for the PocketBase community.

