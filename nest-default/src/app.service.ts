import { Injectable } from '@nestjs/common';
import { bubbleSort } from './utils/bubbleSort.utils';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getPing(): { message: string } {
    return { message: 'pong' };
  }

  processData(dtoProcess: { name: string; templateValues: number[] }): {
    name: string;
    sortedValues: number[];
    sum: number;
  } {
    const { name, templateValues } = dtoProcess;
    bubbleSort(templateValues, templateValues.length);
    const sum = templateValues.reduce((acc, num) => acc + num, 0);
    return {
      name,
      sortedValues: templateValues,
      sum,
    };
  }
}
