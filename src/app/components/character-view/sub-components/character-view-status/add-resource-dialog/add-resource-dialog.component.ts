import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';

@Component({
    selector: 'app-add-resource-dialog',
    templateUrl: './add-resource-dialog.component.html',
    styleUrl: './add-resource-dialog.component.scss',
    standalone: false
})
export class AddResourceDialogComponent {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private charService: CharacterService, 
    private dialogRef: MatDialogRef<AddResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { charId: string }) {
    this.form = this.fb.group({
      label: ['', Validators.required],
      max: [0, Validators.required],
      description: ['', Validators.required],
      color: ['#b3b3b3', Validators.required],
      isTemporary: true,
      shortRest: false,
      automaticResolve: false
    });
  }

  public confirm() {
    const result = this.form.value;
    result.value = result.max;
    this.charService.addResource(this.data.charId, result).then(() => {
      this.dialogRef.close();
    });
  }
}
