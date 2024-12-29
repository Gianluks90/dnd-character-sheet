import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';

interface Condition {
  name: string;
  description: string;
  icon: string;
  isPermanent: boolean;
}

@Component({
  selector: 'app-condition-dialog',
  templateUrl: './condition-dialog.component.html',
  styleUrl: './condition-dialog.component.scss'
})

export class ConditionDialogComponent {

  private conditions_url = './assets/settings/conditions.json';
  private conditions_icons_url = './assets/settings/conditionsIcon.json';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConditionDialogComponent>,
    private charService: CharacterService,
    @Inject(MAT_DIALOG_DATA) public data: { characters: any[] }) {

    fetch(this.conditions_url)
      .then((response) => response.json())
      .then((data) => {
        this.conditions = data.map((condition: any) => {
          return {
            name: condition.name,
            description: condition.description,
            icon: condition.icon,
            // isPermanent: false
          };
        }).sort((a: Condition, b: Condition) => a.name.localeCompare(b.name));
      });

    fetch(this.conditions_icons_url)
      .then((response) => response.json())
      .then((data) => {
        this.conditionsIcons = data;
      });

    this.form = this.fb.group({
      characters: [[this.data.characters.length > 1 ? [] : this.data.characters[0]], Validators.required],
      conditions: ['', Validators.required],
      custom: false
    });

    this.conditionForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      icon: ['', Validators.required],
      isPermanent: false
    });
  }

  public conditions: Condition[] = [];
  public conditionsIcons: any[] = [];
  public form: FormGroup;
  public conditionForm: FormGroup;

  public addCustomCondition(): void {
    this.conditions.push(this.conditionForm.value);
    this.form.get('custom').setValue(false);
    this.conditionForm.reset();
  }

  public selectIcon(index: number): void {
    this.conditionForm.get('icon').setValue(this.conditionsIcons[index].url);
  }

  public confirm(): void {
    this.form.get('characters').value.forEach((char: any) => {
      const newConditions = char.parametriVitali.conditions.concat(this.form.value.conditions);
      this.charService.updateCharacterConditions(char.id, newConditions);
    });

    this.dialogRef.close({
      status: 'success',
      // characters: this.form.value.characters,
      // conditions: this.form.value.conditions,
    });
  }
}
