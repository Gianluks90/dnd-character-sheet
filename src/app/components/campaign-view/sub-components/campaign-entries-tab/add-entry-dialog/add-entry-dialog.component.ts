import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';

@Component({
    selector: 'app-add-entry-dialog',
    templateUrl: './add-entry-dialog.component.html',
    styleUrl: './add-entry-dialog.component.scss',
    standalone: false
})
export class AddEntryDialogComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddEntryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { entry: any }) {}

  public form = this.fb.group({
    id: [this.generateRandomId()],
    title: ['', Validators.required],
    content: ['', Validators.required],
    tag: ['', Validators.required],
    lastUpdate: new Date(),
    userId: getAuth().currentUser.uid,
    backgroundColor: ['#212121'],
    contrastColor: ['#efefef']
  });

  ngOnInit() {
    if (this.data.entry) {
      this.form.patchValue(this.data.entry);
    }
  }

  public generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public confirm() {
    if (this.data.entry) {
      this.dialogRef.close({
        status: 'edited',
        entry: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        entry: this.form.value
      })
    }
  }

  delete() {
    if (this.data.entry) {
      this.dialogRef.close({
        status: 'deleted',
        entry: this.form.value
      })
    }
  }
}
