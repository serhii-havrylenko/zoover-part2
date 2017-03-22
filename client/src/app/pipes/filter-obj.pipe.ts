import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObj'
})
export class FilterObjPipe implements PipeTransform {

  transform(value: any): any {
    if (!value || !Array.isArray(value)) {
      return value;
    }

    return value.filter((el) => !el.match(/^__/));
  }

}
