import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Store } from '../../../../store/store';
import { Configs } from '../../../../models/Configs.model';

@Component({
  selector: '[db-subgrid]',
  templateUrl: './subgrid.component.html',
  styleUrls: ['./subgrid.component.scss']
})
export class SubgridComponent implements OnInit {

  @Input()
  store: Store;

  @Input()
  configs: Configs;

  @Input()
  expand_tracker: Object;

  @Input()
  edit_tracker: Object;

  @Input()
  internal_configs: any;

  @Input()
  row_data: any;

  @Input()
  cellclick: EventEmitter<any>;

  @Input()
  expand: EventEmitter<any>;

  constructor() { }

  ngOnInit() {
  }

  onRowExpand(event) {
    const row_data = event.data;

    const promise = new Promise((resolve, reject) => {
      this.expand.emit({
        data: row_data,
        resolve: resolve
      });
    });

    promise.then((child_rows: any) => {
      this.expand_tracker[row_data.pathx] = true;
      const blank_row: any = this.store.showBlankRow(row_data);

      child_rows.map(child => {
        child.leaf = true;
      });
      blank_row.children = child_rows;

    }).catch((err) => {});
  }

  onRowCollapse(event) {
    const row_data = event.data;
    this.expand_tracker[row_data.pathx] = false;
  }

  sortColumn(row_data, column) {
    const sort_by = column.name;

    // If already sorted then reverse.
    column.sort_type = column.sorted ? !column.sort_type : 1;
    column.sorted = 1;

    column.sort_type ? row_data.children.sort((a, b) => (a[sort_by] > b[sort_by]) ? 1 : ((b[sort_by] > a[sort_by]) ? -1 : 0)) :
      row_data.children.sort((a, b) => (a[sort_by] < b[sort_by]) ? 1 : ((b[sort_by] < a[sort_by]) ? -1 : 0));
  }

}
