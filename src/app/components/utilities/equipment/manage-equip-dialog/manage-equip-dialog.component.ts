import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-manage-equip-dialog',
  templateUrl: './manage-equip-dialog.component.html',
  styleUrl: './manage-equip-dialog.component.scss'
})
export class ManageEquipDialogComponent {

  public form: FormGroup;
  public armorsSelection: Item[] = [];
  public ammoSelection: Item[] = [];
  public mainHandSelection: Item[] = [];
  public offHandSelection: Item[] = [];
  public othersSelection: Item[] = [];

  private originalOffHandSelection: Item[] = [];

  public sets: FormArray;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ManageEquipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventory: Item[], sets: any[] }
  ) {
    this.form = this.fb.group({
      armor: '',
      others: [],
      ammo: '',
      sets: this.fb.array([])
    });
    this.sets = this.fb.array([]);
  }

  ngOnInit(): void {
    this.armorsSelection = this.data.inventory.filter(item => item.CA > 0 && !item.shield);
    this.ammoSelection = this.data.inventory.filter(item => item.category.toLowerCase() === 'munizioni');

    this.form.get('armor').setValue(this.armorsSelection.filter(item => item.weared)[0]);
    this.form.get('ammo').setValue(this.ammoSelection.filter(item => item.weared)[0]);

    this.mainHandSelection = this.data.inventory.filter(item => item.damageFormula !== '');
    this.originalOffHandSelection = JSON.parse(JSON.stringify(this.mainHandSelection.concat(this.data.inventory.filter(item => item.CA > 0 && item.shield))));
    this.offHandSelection = this.mainHandSelection.concat(this.data.inventory.filter(item => item.CA > 0 && item.shield));
    this.othersSelection = this.data.inventory.filter(item => item.CA === 0 && item.damageFormula === '' && item.category.toLowerCase() !== 'munizioni');
    this.form.get('others').patchValue(this.othersSelection.filter(item => item.weared));

    this.sets = this.form.get('sets') as FormArray;
    if (this.data.sets.length > 0) {
      this.data.sets.forEach(set => {
        // Utilizza find per ottenere l'oggetto Item corrispondente ai valori di mainHand e offHand
        const mainHandItem = this.mainHandSelection.find(item => item.id === (set.mainHand ? set.mainHand.id : ''));
        const offHandItem = this.offHandSelection.find(item => item.id === (set.offHand ? set.offHand.id : ''));
        this.sets.push(this.fb.group({
          name: [set.name, Validators.required],
          skill: [set.skill, Validators.required],
          mainHand: [mainHandItem], // Utilizza direttamente l'oggetto Item
          offHand: [offHandItem], // Utilizza direttamente l'oggetto Item
          proficient: [set.proficient || false],
          dualWield: [set.dualWield || false],
          versatile: [set.versatile || false]
        }));
      });
    }
  }

  public addSet(): void {
    const set = this.fb.group({
      name: ['', Validators.required],
      skill: ['', Validators.required],
      mainHand: '',
      offHand: '',
      dualWield: false,
      versatile: false,
    });
    set.get('offHand').disable();
    this.sets.push(set);

    set.get('mainHand').valueChanges.subscribe((value: any) => {
      if (value) {
        this.offHandSelection = this.originalOffHandSelection.slice(); // Copia profonda dell'array originale
        const index = this.offHandSelection.findIndex((item: Item) => item.id === value.id);
        if (index > -1) {
          this.offHandSelection = this.offHandSelection.filter((item: Item, i: number) => i !== index);
        } else {
          this.offHandSelection = this.originalOffHandSelection.slice(); // Copia profonda dell'array originale
        }
        set.get('offHand').enable();
      }
    });
  }

  public removeSet(index: number): void {
    this.sets.removeAt(index);
  }

  public resetForm(): void {
    this.form.reset();
    this.sets.clear();
  }

  public confirm(): void {
    const result: any[] = [];
    if (this.form.value.armor) result.push(this.form.value.armor);
    if (this.form.value.ammo) result.push(this.form.value.ammo);
    if (this.form.value.others && this.form.value.others.length > 0) result.push(...this.form.value.others);
    // const result: any[] = [this.form.value.armor, ...this.form.value.others];
    result.forEach(item => {
      item.weared = true;
    });
    this.dialogRef.close({
      status: 'success',
      weared: result,
      sets: this.form.value.sets
    });
  }
}
