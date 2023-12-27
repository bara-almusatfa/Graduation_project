const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();

app.use(cors());



app.get("/nmap/scan", (req, res) => {
  // Replace 'target' with the IP or hostname you want to scan
  const target = req.query.target || "google.com";

  // Run Nmap command
  const nmapCommand = `
  nmap -sV -sC -T5 -oX scan.xml ${target} ; clear ;  nmap2json  convert scan.xml
    `;

  exec(nmapCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running Nmap: ${error.message}`);
      return res.status(500).send("Internal Server Error");
    }
    if (stderr) {
      console.error(`Nmap error: ${stderr}`);
    }

    res.set("Content-Type", "text/plain");

    // Send the Nmap scan results to the client
    res.send(stdout);
  });
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
      'Authorization': 'Token=9023d9994d4377ac33ec97f3660dcf5fd3e1fcc6c79f3f6a972ae47e7ff363bf'
    }
  };
   
   axios.request(options).then(function (response) {
       output  = response
      res.send(output.data);
  }).catch(function (error) {
      console.error(error);
  });
   
});

app.get("/", (req, res) => {
  res.redirect("/nmap/scan");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("Server started on port 3001");
});
