import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-add-achievement-dialog',
    templateUrl: './add-achievement-dialog.component.html',
    styleUrl: './add-achievement-dialog.component.scss',
    standalone: false
})
export class AddAchievementDialogComponent {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddAchievementDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { achievement: any, characters: any[] }) {}

  public form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    dmNotes: '',
    icon: '',
    lastUpdate: new Date(),
    visible: false,
    reclamedBy: []
  });

  ngOnInit() {
    if (this.data.achievement) {
      this.form.patchValue(this.data.achievement);
    }
  }

  public confirm() {
    if (this.data.achievement) {
      this.dialogRef.close({
        status: 'edited',
        achievement: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        achievement: this.form.value
      })
    }
  }

  delete() {
    if (this.data.achievement) {
      this.dialogRef.close({
        status: 'deleted',
        achievement: this.form.value
      })
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
