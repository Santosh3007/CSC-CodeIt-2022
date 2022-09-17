import express from 'express';
import IndexController from '../controllers/IndexController';

const swap = (arr: string[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

export default () => {
  const indexRouter = express.Router();
  const indexController = new IndexController();
  const fs = require('fs');
  const lookupTablePath = 'src/persist/lookupTable.txt';

  indexRouter.post('/instantiateDNSLookup', (req, res) => {
    let lookupTable = req.body.lookupTable;
    let str = '';
    for (const property in lookupTable) {
      str += property + ',' + lookupTable[property] + ',';
    }
    fs.writeFile(lookupTablePath, str, (err: Error) => {
      if (err) {
        res.json({success: false});
      }
    });
    res.json({success: true});
  });

  indexRouter.post('/simulateQuery', (req, res) => {
    let dnsLookup: string[] = [];
    fs.readFile(lookupTablePath, 'utf8', (err: Error, data: string) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data.split(','));
      dnsLookup = data.split(',');
      console.log(dnsLookup);
      let jsonRes = [];
      const cacheSize = req.body.cacheSize;
      const log: string[] = req.body.log;
      let cache: string[] = [];
      let cacheAddress: string[] = [];
      for (let i = 0; i < log.length; i++) {
        let name = log[i];
        console.log(dnsLookup.includes(name));
        if (cache.includes(name)) {
          let address = cacheAddress[cache.indexOf(name)];
          let ind = cache.indexOf(name);
          jsonRes.push({
            status: 'cache hit',
            ipAddress: address,
          });
          cache.splice(ind, 1);
          cacheAddress.splice(ind, 1);
          cache.push(name);
          cacheAddress.push(address);
        } else if (dnsLookup.includes(name)) {
          jsonRes.push({
            status: 'cache miss',
            ipAddress: dnsLookup[dnsLookup.indexOf(name) + 1],
          });
          cache.push(name);
          cacheAddress.push(dnsLookup[dnsLookup.indexOf(name) + 1]);
          if (cache.length > cacheSize) {
            cache.shift();
            cacheAddress.shift();
          }
        } else {
          jsonRes.push({
            status: 'invalid',
            ipAddress: null,
          });
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(jsonRes);
    });
  });

  return indexRouter;
};
