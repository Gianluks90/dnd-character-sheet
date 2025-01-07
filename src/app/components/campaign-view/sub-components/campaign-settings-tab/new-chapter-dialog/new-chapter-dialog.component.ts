import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-new-chapter-dialog',
    templateUrl: './new-chapter-dialog.component.html',
    styleUrl: './new-chapter-dialog.component.scss',
    standalone: false
})
export class NewChapterDialogComponent {

  public form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<NewChapterDialogComponent>) {}

  public confirm() {
    this.dialogRef.close({
      status: 'success',
      title: this.form.value.title,
      description: this.form.value.description
    })
  }

  public cancel() {
    this.dialogRef.close({
      status: 'cancel'
    });
  }

}
