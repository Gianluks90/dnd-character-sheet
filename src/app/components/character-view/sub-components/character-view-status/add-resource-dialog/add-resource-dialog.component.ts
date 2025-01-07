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
      nome: ['', Validators.required],
      valoreMassimo: [0, Validators.required],
      valoreAttuale: 0,
      used: [],
      color: ['#b3b3b3', Validators.required],
      isTemporary: false
    });
  }

  public setValoreAttuale(value: any) {
    const risorsa = this.form;
    const used = new Array(parseInt(value)).fill(false);
    risorsa.removeControl('used');
    risorsa.addControl('used', this.fb.array(used));
  }

  public confirm() {
    this.form.value.valoreAttuale = parseInt(this.form.value.valoreMassimo);
    this.charService.addResource(this.data.charId, this.form.value).then(() => {
      this.dialogRef.close();
    });
  }
}
