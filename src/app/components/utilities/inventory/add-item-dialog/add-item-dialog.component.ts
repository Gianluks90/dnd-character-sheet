import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Damage, Item, Trait } from 'src/app/models/item';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrl: './add-item-dialog.component.scss'
})
export class AddItemDialogComponent {

  public form: FormGroup = this.fb.group(Item.create(this.fb));
  public selectIcons: any[] = [];
  public weaponProperties: any[] = [];
  public type: string = '';
  public traits: FormArray;
  public extraDamages: FormArray;
  public artifactProperties: FormArray;
  public isCampaign: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { inventory: Item[], item?: Item }, private dialogRef: MatDialogRef<AddItemDialogComponent>, private fb: FormBuilder, private httpClient: HttpClient) {
    this.traits = this.fb.array([]);
    this.extraDamages = this.fb.array([]);
    this.artifactProperties = this.fb.array([]);
    this.isCampaign = window.location.href.includes('campaign-view');
  }

  public rangeRequired: boolean = false;
  public versatileDiceRequired: boolean = false;

  ngOnInit() {
    this.httpClient.get('./assets/settings/selectIcons.json').subscribe((data: any[]) => {
      this.selectIcons = data;
    });
    this.httpClient.get('./assets/settings/weaponProperties.json').subscribe((data: any[]) => {
      this.weaponProperties = data;
    });
    this.traits = this.form.controls['traits'] as FormArray;
    this.extraDamages = this.form.controls['extraDamages'] as FormArray;
    this.artifactProperties = this.form.controls['artifactProperties'] as FormArray;

    if (this.data.item) {
      this.form.patchValue(this.data.item);
      this.type = this.data.item.category;
      this.data.item.traits.forEach((trait: Trait) => {
        this.traits.push(this.fb.group(trait));
      });
      if (this.data.item.extraDamages && this.data.item.extraDamages.length > 0) { // Necessario per gli oggetti pre esistenti
        this.data.item.extraDamages.forEach((damage: any) => {
          this.extraDamages.push(this.fb.group(damage));
        });
      }

      this.data.item.artifactProperties.forEach((prop: Trait) => {
        this.artifactProperties.push(this.fb.group(prop));
      });
    }

    this.rangeRequired = false;
    this.versatileDiceRequired = false;
    if (this.form.get('weaponProperties').value) {
      this.form.get('weaponProperties').value.forEach((prop: any) => {
        if (prop.name.toLowerCase() === 'lancio' || prop.name.toLowerCase() === 'gittata') {
          this.rangeRequired = true;
        }
        if (prop.name === 'versatile') {
          this.versatileDiceRequired = true;
        }
      });
    }

    this.form.get('weaponProperties').valueChanges.subscribe((value: any) => {
      let rangeValidator: ValidatorFn | null = null;
      let versatileDiceValidator: ValidatorFn | null = null;

      this.rangeRequired = false;
      this.versatileDiceRequired = false;

      value.forEach((prop: any) => {
        if (prop.name.toLowerCase() === 'lancio' || prop.name.toLowerCase() === 'gittata') {
          rangeValidator = Validators.required;
          this.rangeRequired = true;
        }
        if (prop.name === 'versatile') {
          versatileDiceValidator = Validators.required;
          this.versatileDiceRequired = true;
        }
      });

      this.form.get('range').setValidators(rangeValidator);
      this.form.get('versatileDice').setValidators(versatileDiceValidator);
      this.form.get('range').updateValueAndValidity();
      this.form.get('versatileDice').updateValueAndValidity();
    });

  }

  public duplicate() {
    this.dialogRef.close({
      status: 'duplicate',
      item: this.form.value
    })
  }

  confirm() {
    if (this.data.item) {
      this.dialogRef.close({
        status: 'edited',
        item: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        item: this.form.value
      })
    }
  }

  public showDeleteButton: boolean = false;
  showDelete() {
    this.showDeleteButton = true;
  }

  delete() {
    if (this.data.item) {
      this.dialogRef.close({
        status: 'deleted',
        item: this.form.value
      })
    }
  }

  setType(event: any) {
    this.type = event.value;
  }

  addTrait() {
    const trait = this.fb.group(Trait.create(this.fb));
    this.traits.push(trait);
  }

  deleteTrait(index: number) {
    this.traits.removeAt(index);
  }

  addProp() {
    const prop = this.fb.group(Trait.create(this.fb));
    this.artifactProperties.push(prop);
  }

  deleteProp(index: number) {
    this.artifactProperties.removeAt(index);
  }

  addDamage() {
    const damage = this.fb.group(Damage.create(this.fb));
    this.extraDamages.push(damage);
  }

  deleteDamage(index: number) {
    this.extraDamages.removeAt(index);
  }

  compareFn(prop1: any, prop2: any): boolean {
    return prop1 && prop2 ? prop1.name === prop2.name : prop1 === prop2;
  }

  public getFormControl(name: string) {
    return this.form.controls[name] as FormControl;
  }
}
