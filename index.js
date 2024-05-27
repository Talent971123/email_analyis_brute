import { readdir, rm } from "node:fs/promises";

import { rimraf } from "rimraf";

import loaders from "./loaders/index.js";
import config from "./config/index.js";
import { exactAndParseFile, save_data } from "./utils/index.js";
import AdmZip from "adm-zip";
import cryptoController from "./controllers/cryptoController.js";

async function start() {
  await loaders().catch((e) => {
    console.log("An error OCCURED!");
    throw e;
  });

  let test_folder = config.ROOTFOLDER;
  const files = await readdir(test_folder);
  let directory_zipfile_list = [];

  Promise.all(
    files.map((file) => {
      if (file.indexOf(".zip") !== -1) {
        directory_zipfile_list.push(file);
      }
    })
  );

  console.log("directory_zipfile_list");
  await Promise.all(
    directory_zipfile_list.map(async (item) => {
      //! extract zip
      console.log("start", item);
      const zip = new AdmZip(test_folder + item);
      return await zip.extractAllTo(test_folder + "temp", true);
    })
  );

  const folders = await readdir(test_folder + "temp/");

  for (let i = 0; i <= folders.length; i++) {
    console.log(folders[i]);
    let result = await exactAndParseFile(test_folder + "temp/" + folders[i]);
    let res = await save_data(result);
  }

  await rimraf(test_folder + "temp/");

  await cryptoController.mergeEmails();

  console.log("````````````````end``````````````````````");
  return true;
}

start();
