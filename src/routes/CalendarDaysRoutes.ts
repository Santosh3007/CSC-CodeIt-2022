import express from 'express';
import {resourceLimits} from 'worker_threads';
import IndexController from '../controllers/IndexController';

export default () => {
  const indexRouter = express.Router();
  const indexController = new IndexController();

  const eqSet = (xs: Set<number>, ys: Set<number>) =>
    xs.size === ys.size && [...xs].every(x => ys.has(x));

  indexRouter.post('/calendarDays', (req, res) => {
    let numbers = req.body.numbers;
    let result: Set<number>[] = [];
    let year = numbers[0];
    for (let i = 0; i < 12; i++) {
      result.push(new Set<number>());
    }
    for (let i = 1; i < numbers.length; i++) {
      let date = new Date(year, 0, numbers[i]);
      if (numbers[i] > 0 && numbers[i] <= (year % 4 === 0 ? 366 : 365))
        result[date.getMonth()].add(date.getDay());
    }
    let part1 = '';
    for (let i = 0; i < result.length; i++) {
      let curr = '';
      if (eqSet(result[i], new Set([0, 1, 2, 3, 4, 5, 6]))) {
        console.log(result[i]);
        curr = 'alldays';
      } else if (eqSet(result[i], new Set([0, 6]))) {
        curr = 'weekend';
      } else if (eqSet(result[i], new Set([1, 2, 3, 4, 5]))) {
        curr = 'weekday';
      } else {
        curr += result[i].has(1) ? 'm' : ' ';
        curr += result[i].has(2) ? 't' : ' ';
        curr += result[i].has(3) ? 'w' : ' ';
        curr += result[i].has(4) ? 't' : ' ';
        curr += result[i].has(5) ? 'f' : ' ';
        curr += result[i].has(6) ? 's' : ' ';
        curr += result[i].has(0) ? 's' : ' ';
      }
      part1 += curr + ',';
    }
    // console.log(part1.length);

    let year2 = 2001 + part1.indexOf(' ');
    let part2 = [year2];
    let result2 = part1.split(',');
    let firstDay = new Date(year2, 0, 1);

    for (let i = 0; i < 12; i++) {
      for (let j = 1; j < 8; j++) {
        let currDay = new Date(year2, i, j);
        // console.log(currDay);
        // console.log(firstDay);
        // console.log(
        // (currDay.getTime() - firstDay.getTime()) / (1000 * 3600 * 24)
        // );
        if (result[i].has(currDay.getDay())) {
          const diff =
            Math.ceil(
              (currDay.getTime() - firstDay.getTime()) / (1000 * 3600 * 24)
            ) + 1;
          part2.push(diff);
        }
      }
    }
    res.json({part1: part1, part2: part2});
  });

  return indexRouter;
};
