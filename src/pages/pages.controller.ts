import { Controller, Get, Render } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('pages')
export class PagesController {

  @Get()
  @Render('index')
  index(): Observable<{ message: string }> {
    return of({ message: 'Hello World' });
  }
}
