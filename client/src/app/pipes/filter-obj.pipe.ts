import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObj'
})
export class FilterObjPipe implements PipeTransform {

  transform(value: any, showZeroRating?: boolean, obj?: any): any {
    if (!value || !Array.isArray(value)) {
      return value;
    }

    if (!showZeroRating && obj) {
      return value.filter((el) => !el.match(/^__/) && obj[el] > 0);
    }

    return value.filter((el) => !el.match(/^__/));
  }

}
