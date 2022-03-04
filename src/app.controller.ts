import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './modules/user/services/user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cache')
  async getCachedValue(): Promise<any> {
    try {
      return await this.appService.getFromCache('key');
    } catch (e) {
      throw e;
    }
  }

  @Post('cache')
  async setCachedValue(): Promise<any> {
    try {
      return await this.appService.saveInCache('key', { content: 'test' });
    } catch (e) {
      throw e;
    }
  }

  @Post('event')
  async emitEvent(): Promise<any> {
    try {
      return await this.appService.emit({ content: 'test' });
    } catch (e) {
      throw e;
    }
  }
}
