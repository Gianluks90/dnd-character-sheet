import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddItemDialogComponent } from 'src/app/components/utilities/inventory/add-item-dialog/add-item-dialog.component';
import { Spell } from 'src/app/models/spell';

@Component({
    selector: 'app-add-spell-dialog',
    templateUrl: './add-spell-dialog.component.html',
    styleUrl: './add-spell-dialog.component.scss',
    standalone: false
})
export class AddSpellDialogComponent {

  public selectIcons: any[] = [];
  public isMobile: boolean = false;
  public form: FormGroup = this.fb.group(Spell.create(this.fb));
  constructor(@Inject(MAT_DIALOG_DATA) public data: {spells: Spell[], spell?: Spell}, private dialogRef: MatDialogRef<AddItemDialogComponent>, private fb: FormBuilder, private httpClient: HttpClient){
    this.isMobile = window.innerWidth <= 500;
  }

  ngOnInit(){
    this.httpClient.get('./assets/settings/selectIconsSpells.json').subscribe((data: any[]) => {
      this.selectIcons = data;
    });
    if (this.data.spell) {
      this.form.patchValue(this.data.spell);
    }
  }

  confirm() {
    if (this.data.spell) {
      this.dialogRef.close({
        status: 'edited',
        spell: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        spell: this.form.value
      })
    }    
  }

  public resetScuola() {
    this.form.patchValue({
      scuola: '',
      scuolaPersonalizzata: ''
    });
  }

  delete() {
    if (this.data.spell) {
      this.dialogRef.close({
        status: 'deleted',
        spell: this.form.value
      })
    }
  }
} 
