import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthcheck(): object {
    return {
      Status: 'Ok',
      checkCount: check.count++,
    };
  }
}

export class check {
  static count = 0;
}
