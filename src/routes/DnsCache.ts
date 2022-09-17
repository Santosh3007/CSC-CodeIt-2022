import express from 'express';
import IndexController from '../controllers/IndexController';

export default () => {
  const indexRouter = express.Router();
  const indexController = new IndexController();
  const fs = require('fs');
  const dnsCachePath = __dirname + '/../persist/dnsCache.txt';
  const lookupTablePath = __dirname + '/../persist/lookupTable.txt';

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
      for (let i = 0; i < log.length; i++) {
        let name = log[i];
        console.log(dnsLookup.includes(name));
        if (cache.includes(name)) {
          jsonRes.push({
            status: 'cache hit',
            ipAddress: dnsLookup[cache.indexOf(name) * 2 + 1],
          });
        } else if (dnsLookup.includes(name)) {
          jsonRes.push({
            status: 'cache miss',
            ipAddress: dnsLookup[dnsLookup.indexOf(name) + 1],
          });
          cache.push(name);
          if (cache.length > cacheSize) {
            cache.shift();
          }
        } else {
          jsonRes.push({
            status: 'invalid',
            ipAddress: null,
          });
        }
      }

      res.status(200).json({JSON: jsonRes});
    });
  });

  return indexRouter;
};
