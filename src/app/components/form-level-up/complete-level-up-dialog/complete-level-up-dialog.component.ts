import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormService } from 'src/app/services/form.service';
import { CompleteCharacterDialogComponent } from '../../form-create/complete-character-dialog/complete-character-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
    selector: 'app-complete-level-up-dialog',
    templateUrl: './complete-level-up-dialog.component.html',
    styleUrls: ['./complete-level-up-dialog.component.scss'],
    standalone: false
})
export class CompleteLevelUpDialogComponent {
  public form = this.fb.group({
    confirm: [false, Validators.requiredTrue]
  });

  constructor(
    private formService: FormService,
    public dialogRef: MatDialogRef<CompleteLevelUpDialogComponent>,
    private fb: FormBuilder,
    private charService: CharacterService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, form: FormGroup }) { }

    public confirm() {
      this.formService.completeForm(this.data.id, this.data.form).then(() => {
        this.dialogRef.close('confirm');
      })
    }
}
