import fs from 'fs';
import zlib from 'zlib';
import { pipeline } from 'stream/promises';
const unlink = fs.promises.unlink;


const downloadURL = 'https://aviationweather.gov/data/cache/stations.cache.json.gz';
const fileName = 'stations.cache.json.gz';

async function downloadAndUnzipFile() {
    try {
      const response = await fetch(downloadURL);
  
      if (response.status === 200) {
        const fileStream = fs.createWriteStream(fileName);
  
        // Pipe the response body into the file stream to save the gzipped file
        await pipeline(response.body, fileStream);

        console.log(`Downloaded ${fileName}`);  
  
        // Now, unzip the downloaded gzipped file
        const gunzip = zlib.createGunzip();
        const input = fs.createReadStream(fileName);
        const output = fs.createWriteStream(fileName.replace('.gz', '')); // Remove the '.gz' extension
  
        await new Promise((resolve, reject) => {
          input.pipe(gunzip).pipe(output);
          input.on('error', reject);
          output.on('finish', resolve);
        });
  
        console.log(`Unzipped ${fileName}`);
  
        // Remove the gzipped file after unzipping
        await unlink(fileName);
      } else {
        console.error(`Error downloading file. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error downloading or unzipping file: ${error.message}`);
    }
  }
  
  // Call the async function to start the process
  downloadAndUnzipFile();