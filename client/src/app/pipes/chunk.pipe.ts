import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {

  transform(value: any, chunkSize: any): any {
    if (!value || !Array.isArray(value)) {
      return value;
    }

    let chunks = [];
    for (let i = 0; i < value.length; i += chunkSize) {
      chunks.push(value.slice(i, i + chunkSize));
    }

    return chunks;
  }

}
