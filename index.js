const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();
app.use(cors());
const util = require('util');
const xml2js = require('xml2js');


// Promisify the exec function for easier use with async/await
const execAsync = util.promisify(exec);
const parseXmlAsync = util.promisify(xml2js.parseString);

app.use(express.json());


app.get('/nmap/scan', async (req, res) => {
  const target = req.query.target || "google.com";
  try {
    // Get the target IP address from the request body
    

    if (!target) {
      return res.status(400).json({ error: 'Target IP address is required.' });
    }

    // Run Nmap scan with additional options and capture XML output
    const command = `nmap -oX - -A -T5 -sV -sC ${target}`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      return res.status(500).json({ error: stderr });
    }

    // Parse the XML output
    const parsedResult = await parseXmlAsync(stdout);

    // Extract relevant information
    const hostInfo = parsedResult.nmaprun.host[0];
    const openPorts = hostInfo.ports[0].port.map((port) => ({
      number: port.$.portid,
      protocol: port.$.protocol,
      state: port.state[0].$.state,
      service: port.service[0].$.name,
      version: port.service[0].$.product,
    }));

    // Organize results into separate JSON properties
    const result = {
      hostInfo,
      openPorts,
    };

    // Return Nmap scan results as JSON
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






const axios = require("axios");
 
app.get("/whois/scan", (req, res,error) => {
  const target = req.query.target || "google.com";
  const axios = require("axios");
 
  const options = {
    method: 'GET',
    url: 'https://whoisjson.com/api/v1/whois',
    params: {domain: 'google.com'},
    headers: {
      'Authorization': 'Token=<YOUR-API-KEY>'
    }
  };
   
   axios.request(options).then(function (response) {
       output  = response
      res.send(output.data);
  }).catch(function (error) {
      console.error(error);
  });
   
});



app.get('/sqlmap/scan', async (req, res) => {
  try {
    // Get the target URL from the query parameters
    const target = req.query.target || "google.com";

    if (!target) {
      return res.status(400).json({ error: 'Target URL is required.' });
    }

    // Determine SQLMapAPI URL dynamically
    const { stdout: sqlmapApiUrl } = await execAsync('sqlmapapi --url');
    const apiUrl = sqlmapApiUrl.trim();

    // Forward the request to SQLMapAPI
    const response = await axios.post(`${apiUrl}/task/new`, {
      url: target,
    });

    const taskId = response.data.taskid;

    // Wait for the scan to complete (you may adjust this based on your requirements)
    await waitForScanCompletion(taskId, apiUrl);

    // Retrieve scan results
    const scanResults = await axios.get(`${apiUrl}/scan/${taskId}/data`);

    // Return SQLMap scan results as JSON
    res.json(scanResults.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to wait for scan completion (you may need to adjust this)
async function waitForScanCompletion(taskId, apiUrl) {
  while (true) {
    const taskInfo = await axios.get(`${apiUrl}/scan/${taskId}`);

    if (taskInfo.data.status === 'terminated') {
      break;
    }

    // Adjust the delay based on your requirements
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}


app.get("/", (req, res) => {
  res.redirect("/nmap/scan");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Server started on port 3001");
});
