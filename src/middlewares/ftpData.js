const ftp = require('ftp');
const csv = require('csv-parser');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

// FTP credentials
const ftpCredentials = {
  host: '49.12.228.153',
  user: 'olivier',
  password: 'q2S_MgmUZA',
  port: '2962',
};

// File path on the FTP server
const filePath = '/exported_trades.csv';

// Create an FTP client instance
const client = new ftp();

// Function to retrieve the file data from FTP
const getFileDataFromFTP = () => {
  return new Promise((resolve, reject) => {
    // Connect to the FTP server  
    client.connect(ftpCredentials);

    // When connected, retrieve the file
    client.on('ready', async () => {
      client.get(filePath, (err, ftpStream) => {
        if (err) {
          reject(err); // Reject the promise with the error
          return;
        }

        // Create a writable stream to collect the CSV data
        const dataChunks = [];
        const writableStream = new require('stream').Writable({
          objectMode: true,
          write(chunk, encoding, next) {
            dataChunks.push(chunk);
            next();
          },
        });

        // Pipeline: FTP stream => CSV parser => Writable stream
        pipeline(ftpStream, csv(), writableStream)
          .then(() => {
            // Combine the data chunks into a single array
            const dataArray = dataChunks;
            resolve(dataArray); // Resolve the promise with the array of CSV data
          })
          .catch((pipelineErr) => {
            reject(pipelineErr); // Reject the promise with the pipeline error
          });
      });
    });

    // Handle connection errors
    client.on('error', (err) => {
      reject(err); // Reject the promise with the error
    });
  });
};

// Usage of the getFileDataFromFTP function
const processFileData = async () => {
  try {
    const fileData = await getFileDataFromFTP();
    // Perform further processing or return the data as needed
    return fileData;
  } catch (error) {
    console.error('Error retrieving file data:', error);
    // Handle the error appropriately
  } finally {
    // Close the FTP connection when done
    client.end();
  }
};

module.exports = {
  processFileData,
};
