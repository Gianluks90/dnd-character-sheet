import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-complete-character-dialog',
    templateUrl: './complete-character-dialog.component.html',
    styleUrls: ['./complete-character-dialog.component.scss'],
    standalone: false
})
export class CompleteCharacterDialogComponent {

  public form = this.fb.group({
    confirm: [false, Validators.requiredTrue]
  });

  constructor(
    private formService: FormService,
    public dialogRef: MatDialogRef<CompleteCharacterDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, form: FormGroup }) { }

    public confirm() {
      this.formService.completeForm(this.data.id, this.data.form).then(() => {
        this.dialogRef.close('confirm');
      })
    }
}
