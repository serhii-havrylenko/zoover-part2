import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObj'
})
export class FilterObjPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.filter((el) => !el.match(/^__/));
  }

}
