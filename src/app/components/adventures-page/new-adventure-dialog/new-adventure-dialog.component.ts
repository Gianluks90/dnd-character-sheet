import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-new-adventure-dialog',
    templateUrl: './new-adventure-dialog.component.html',
    styleUrl: './new-adventure-dialog.component.scss',
    standalone: false
})
export class NewAdventureDialogComponent {
  public form: FormGroup | null;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewAdventureDialogComponent>) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  public confirm(): void {
    this.dialogRef.close({ status: 'success', adventure: this.form.value });
  }
}
