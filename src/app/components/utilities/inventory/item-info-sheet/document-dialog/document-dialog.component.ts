import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { Item } from 'src/app/models/item';

@Component({
    selector: 'app-document-dialog',
    templateUrl: './document-dialog.component.html',
    styleUrl: './document-dialog.component.scss',
    standalone: false
})
export class DocumentDialogComponent {
  constructor(private dialogRef: MatDialogRef<DocumentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { item: Item }) {}

  public addToNotes(): void {
    const note = {
      id: this.generateRandomId(),
      title: this.data.item.documentTitle,
      content: this.data.item.documentDescription,
      tag: 'Campagna',
      lastUpdate: new Date(),
      userId: getAuth().currentUser.uid,
      backgroundColor: '#212121',
      contrastColor: '#efefef'
    }
    this.dialogRef.close({ message: 'notes', entry: note });
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
