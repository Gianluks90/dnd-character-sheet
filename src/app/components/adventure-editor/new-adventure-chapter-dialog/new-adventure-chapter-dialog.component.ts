import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-new-adventure-chapter-dialog',
    templateUrl: './new-adventure-chapter-dialog.component.html',
    styleUrl: './new-adventure-chapter-dialog.component.scss',
    standalone: false
})
export class NewAdventureChapterDialogComponent {
  public form: FormGroup | null;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewAdventureChapterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: '',
      description: ['', Validators.required],
    });

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  public confirm(): void {
    this.dialogRef.close({ status: this.data ? 'edited' : 'success', chapter: this.form.value });
  }
}
