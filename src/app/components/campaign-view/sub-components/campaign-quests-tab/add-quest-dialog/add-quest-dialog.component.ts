import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-quest-dialog',
  templateUrl: './add-quest-dialog.component.html',
  styleUrl: './add-quest-dialog.component.scss'
})
export class AddQuestDialogComponent {
  public form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    dmNotes: '',
    lastUpdate: new Date(),
    nextObjective: '',
    steps: this.fb.array([]),
    visible: false,
    completed: false,
    longQuest: false,
    result: ''
  });

  public steps: FormArray;

  // public steps: FormArray = new FormArray([]);

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddQuestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { quest: any }) {
    this.steps = this.fb.array([]);
    this.steps = this.form.controls['steps'] as FormArray;
   }

  ngOnInit() {
    if (this.data.quest) {
      this.form.patchValue(this.data.quest);
      this.data.quest.steps.forEach((step: any) => {
        this.steps.push(this.fb.group(step));
      });
    }
  }

  public confirm() {
    if (this.data.quest) {
      this.dialogRef.close({
        status: 'edited',
        quest: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        quest: this.form.value
      })
    }
  }

  public addStep() {
    const step = this.fb.group({
      text: ['', Validators.required]
    });
    this.steps.push(step);
  }

  public removeStep(index: number) {
    this.steps.removeAt(index);
  }

  public deleteQuest() {
    this.dialogRef.close({
      status: 'delete'
    });
  }
}
