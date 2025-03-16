import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  getPing(): { message: string } {
    return this.appService.getPing();
  }

  @Post('process')
  processData(@Body() dtoProcess: { name: string; templateValues: number[] }): {
    name: string;
    sortedValues: number[];
    sum: number;
  } {
    return this.appService.processData(dtoProcess);
  }
}
