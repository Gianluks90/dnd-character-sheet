import { Component, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';

@Component({
    selector: 'app-delete-character-dialog',
    templateUrl: './delete-character-dialog.component.html',
    styleUrls: ['./delete-character-dialog.component.scss'],
    standalone: false
})
export class DeleteCharacterDialogComponent {

  public form = this.fb.group({
    confirm: [false, Validators.requiredTrue]
  });

  constructor(
    private characterService: CharacterService,
    private formService: FormService,
    public dialogRef: MatDialogRef<DeleteCharacterDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {id: string} ) { }

    public confirm() {
      this.characterService.deleteCharacterById(this.data.id).then(() => {
        this.formService.deleteImage(this.data.id).then((result) => {
          this.dialogRef.close('confirm');
        });
      })
    }
}
