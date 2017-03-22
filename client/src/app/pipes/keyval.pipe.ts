import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyval'
})
export class KeyvalPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }

    return Object.keys(value);
  }

}
