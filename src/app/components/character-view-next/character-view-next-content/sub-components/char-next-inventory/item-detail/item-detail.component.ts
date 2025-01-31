import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from 'src/app/components/utilities/inventory/add-item-dialog/add-item-dialog.component';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-detail',
  standalone: false,
  
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss'
})
export class ItemDetailComponent {
  constructor(private matDialog: MatDialog) {}

  public _item: Item;
  @Input() set item(item: Item) {
    this._item = item;
  }

  @Output() itemEdited: EventEmitter<Item> = new EventEmitter<Item>();

   openEditDialog(item: Item) {
      this.matDialog.open(AddItemDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '50%',
        autoFocus: false,
        disableClose: true,
        backdropClass: 'as-backdrop-dialog',
        data: { inventory: [], item: item }
      }).afterClosed().subscribe((result: any) => {
        if (!result) return;
        this.itemEdited.emit(result);
      });
    }
}
