// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const argv = require('minimist')(process.argv.slice(2));
const pjson = require('./package.json');

async function main(bucketName, bucketPrefix, directoryPath) {
  // [START upload_directory]
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');
  const fs = require('fs');
  const path = require('path');
  const fileList = [];

  async function uploadDirectory() {
    // Creates a client
    const storage = new Storage();

    // get the list of files from the specified directory
    let dirCtr = 1;
    let itemCtr = 0;
    const pathDirName = path.dirname(directoryPath);

    getFiles(directoryPath);

    function getFiles(directory) {
      fs.readdir(directory, (err, items) => {
        dirCtr--;
        itemCtr += items.length;
        items.forEach(item => {
          const fullPath = path.join(directory, item);
          fs.stat(fullPath, (err, stat) => {
            itemCtr--;
            if (stat.isFile()) {
              fileList.push(fullPath);
            } else if (stat.isDirectory()) {
              dirCtr++;
              getFiles(fullPath);
            }
            if (dirCtr === 0 && itemCtr === 0) {
              onComplete();
            }
          });
        });
      });
    }

    async function onComplete() {
      const resp = await Promise.all(
        fileList.map(filePath => {
          let destination = path.relative(pathDirName, filePath);
          destination = bucketPrefix + destination.replace('dist/', '');

          return storage
            .bucket(bucketName)
            .upload(filePath, {destination: destination})
            .then(
              uploadResp => ({fileName: destination, status: uploadResp[0]}),
              err => ({fileName: destination, response: err})
            );
        })
      );

      const successfulUploads =
        fileList.length - resp.filter(r => r.status instanceof Error).length;
      console.log(
        `${successfulUploads} files uploaded to ${bucketName} successfully.`
      );
    }
  }

  uploadDirectory().catch(console.error);
  // [END upload_directory]
}

function getBucketPrefix() {
  let prefix = 'dev';

  if (argv.v) {
    prefix = argv.v;
  } else if (argv.p) {
    prefix = pjson.version;
  }

  return prefix + '/';
}

main('vtaugment', getBucketPrefix(), 'dist').catch(console.error);
