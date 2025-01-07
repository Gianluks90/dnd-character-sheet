import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attack } from 'src/app/models/attack';

@Component({
    selector: 'app-add-attack-dialog',
    templateUrl: './add-attack-dialog.component.html',
    styleUrl: './add-attack-dialog.component.scss',
    standalone: false
})
export class AddAttackDialogComponent {

  public selectIcons: any[] = [];
  public isMobile: boolean = false;
  public form: FormGroup = this.fb.group(Attack.create(this.fb));

  constructor(private fb: FormBuilder, private httpClient: HttpClient, @Inject(MAT_DIALOG_DATA) public data: { modifiers: any[], attacks: Attack[], attack?: Attack }, private dialogRef: MatDialogRef<AddAttackDialogComponent>) {
    this.isMobile = window.innerWidth <= 500;
  }

  ngOnInit() {
    this.getAllIcons();
    if (this.data.attack) {
      this.form.patchValue(this.data.attack);
    }
  }

  private getAllIcons() {
    if (!localStorage.getItem('selectIconsSpells')) {
      this.httpClient.get('./assets/settings/selectIconsSpells.json').subscribe((data: any[]) => {
        this.selectIcons = data;
        localStorage.setItem('selectIconsSpells', JSON.stringify(data));
      });
      if (!localStorage.getItem('selectIcons')) {
        this.httpClient.get('./assets/settings/selectIcons.json').subscribe((data2: any[]) => {
          this.selectIcons = this.selectIcons.concat(data2);
          localStorage.setItem('selectIcons', JSON.stringify(this.selectIcons));
        });
      }
    } else {
      this.selectIcons = JSON.parse(localStorage.getItem('selectIconsSpells'));
      this.selectIcons = this.selectIcons.concat(JSON.parse(localStorage.getItem('selectIcons')));
    }
  }

  public confirm() {
    if (this.data.attack) {
      this.dialogRef.close({
        status: 'edited',
        attack: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        attack: this.form.value
      })
    }
  }

  public delete() {
    if (this.data.attack) {
      this.dialogRef.close({
        status: 'deleted',
        attack: this.form.value
      })
    }
  }
}
