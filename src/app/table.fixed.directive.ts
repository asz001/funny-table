import { Directive, Input, AfterViewInit, OnChanges } from '@angular/core';
import { ElementRef } from '@angular/core';

@Directive({
  selector: '[appTableFixed]',
})
export class TableFixedDirective implements AfterViewInit {
  @Input()
  widthCell: any[] = [];
  @Input()
  defaultCellWidth = 100;

  @Input()
  border = 1;
  @Input()
  width = window.innerWidth - (window.innerWidth * 0.1);
  @Input()
  rWidth = 0;
  @Input()
  height = window.innerHeight - (window.innerHeight * 0.2);
  @Input()
  rHeight = 0;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const table = this.el.nativeElement;
    const tds = table.querySelectorAll('tbody > tr');
    const trh = table.querySelectorAll('thead > tr');
    this.setWidthHeight(trh, 'th');
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead');
    // set style
    table.style.position = 'relative';
    table.style.display = 'block';
    table.style.overflow = 'hidden';
    tbody.style.maxHeight = this.height - this.rHeight + 'px';
    tbody.style.position = 'relative';
    thead.style.position = 'relative';
    thead.style.display = 'block';
    tbody.style.overflow = 'auto';
    tbody.style.display = 'inline-block';
    table.style.width = this.width + (tbody.offsetWidth - tbody.clientWidth) + this.border + 'px';
    // add fake row
    console.log(this.widthCell);
    let tempw = 0;
    if (this.widthCell && this.widthCell.length > 0) {
      const trNode = document.createElement('tr');
      trNode.style.height = '1px';
      for (const cell of this.widthCell) {
        const tdNode = document.createElement('td');
        tdNode.style.width = tdNode.style.minWidth = tdNode.style.maxWidth = cell + 'px';
        tdNode.style.height = '1px';
        tdNode.style.margin = tdNode.style.padding = tdNode.style.border = '0px';
        trNode.appendChild(tdNode);
        tempw += cell;
      }
      tbody.style.width = (tempw > (this.width - this.rWidth) ? this.width - this.rWidth : tempw) +
                            (tbody.offsetWidth - tbody.clientWidth) + this.border + 'px';
      tbody.appendChild(trNode);
    }
    // fix header scroll
    tbody.addEventListener('scroll', (e) => {
      thead.style.left = -tbody.scrollLeft + 'px';
    }, false);
  }
  setWidthHeight(trh: any, childPath: string): any {
    const matrixh: any = {};
    for (let index = 0; index < trh.length; index++) {
      const childs = trh[index].querySelectorAll(childPath);
      let extendIndex = 0;
      for (let indexChild = 0; indexChild < childs.length; indexChild++) {
        const child = childs[indexChild];
        for (let rowCount = 0; rowCount < child.rowSpan; rowCount++) {
        let widtht = 0;
          for (let colCount = 0; colCount < child.colSpan; colCount++) {
            const x = +index + +rowCount;
            const y = +indexChild + +colCount + extendIndex;
            const yyyy = this.getRealIndexWidth(matrixh, x, y);
            if (!this.widthCell[yyyy]) {
              this.widthCell[yyyy] = this.defaultCellWidth;
            }
            widtht += this.widthCell[yyyy];
            child.style.minWidth = widtht + 'px';
            child.style.maxWidth = widtht + 'px';
            child.style.width = widtht + 'px';
          }
        }
        extendIndex += child.colSpan - 1;
      }
    }
  }

  getRealIndexWidth(matrixh: any, x: number, y: number): any {
    if (!matrixh[x]) {
      matrixh[x] = {};
    }
    if (!matrixh[x][y]) {
      matrixh[x][y] = this.widthCell[y] ||  100;
      return y;
    } else {
      return this.getRealIndexWidth(matrixh, x, (+y + 1));
    }
  }
}
