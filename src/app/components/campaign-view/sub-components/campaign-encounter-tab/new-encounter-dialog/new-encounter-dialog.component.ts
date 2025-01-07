import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-new-encounter-dialog',
    templateUrl: './new-encounter-dialog.component.html',
    styleUrl: './new-encounter-dialog.component.scss',
    standalone: false
})
export class NewEncounterDialogComponent {

  public form: FormGroup | null;

  constructor(
    private dialogRef: MatDialogRef<NewEncounterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      characters: any[],
      addons: any[]
    },
    private fb: FormBuilder) {
    this.form = this.fb.group({
      manualInitiative: [false],
      initiatives: this.fb.array([]),
      characters: [[], [Validators.required, Validators.minLength(1)]],
      addons: this.fb.array([], Validators.required)
    });
    this.form.patchValue({ characters: this.data.characters });
    this.form.value.characters.forEach((character: any) => {
      this.initiatives.push(this.fb.group({
        name: character.informazioniBase.nomePersonaggio,
        initiative: null
      }));
    });
    const initiatives = this.form.get('initiatives') as FormArray; // Cambiato da 'intiatives' a 'initiatives'
    this.form.get('characters').valueChanges.subscribe((characters: any[]) => {
      if (this.form.get('manualInitiative').value) {
        initiatives.clear(); // Cambiato da 'intiatives' a 'initiatives'
        characters.forEach((character: any) => {
          initiatives.push(this.fb.group({ // Cambiato da 'intiatives' a 'initiatives'
            name: character.informazioniBase.nomePersonaggio,
            initiative: null
          }));
        });
      }
    });
  }

  get initiatives(): FormArray {
    return this.form.get('initiatives') as FormArray; // Cambiato da 'intiatives' a 'initiatives'
  }

  public selectedAddons: any[] = [];
  get addons(): FormArray {
    return this.form.get('addons') as FormArray;
  }

  private addEnemy(addon: any) {
    const group = this.fb.group({
      addon: [addon, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.addons.push(group);
    this.selectedAddons.push(addon); // Aggiungi l'addon ai selezionati
  }

  public removeEnemy(index: number) {
    const removedAddon = this.addons.at(index).value.addon;
    this.addons.removeAt(index);
    this.selectedAddons = this.selectedAddons.filter(addon => addon !== removedAddon); // Rimuovi l'addon dai selezionati
  }

  public onAddonSelectionChange(event: any) {
    const selectedAddons = event.value;
    const currentAddons = this.getSelectedAddons();

    selectedAddons.forEach((addon: any) => {
      if (!currentAddons.includes(addon)) {
        this.addEnemy(addon);
      }
    });

    currentAddons.forEach((addon: any, index: number) => {
      if (!selectedAddons.includes(addon)) {
        this.removeEnemy(index);
      }
    });
  }

  private getSelectedAddons(): any[] {
    return this.addons.value.map((e: any) => e.addon);
  }

  public generateEncounter() {
    const addons = this.separateSameNameAddons(this.form.value.addons);
    const parts = [...this.form.value.characters, ...addons];
    const encounter: any[] = [];
    parts.map((part: any) => {
      if (part.informazioniBase) {
        let modDex = Math.floor((part.caratteristiche.destrezza - 10) / 2);
        const bonuses = part.privilegiTratti.flatMap((privilegioTratto: any) => privilegioTratto.bonuses).filter((bonus: any) => bonus !== undefined);
        bonuses.forEach((bonus: any) => {
          if (bonus.element === 'iniziativa') {
            modDex += bonus.value;
          }
        });
        const customInitiative = this.form.value.initiatives.find((i: any) => i.name === part.informazioniBase.nomePersonaggio)?.initiative;
        encounter.push({
          id: this.randomUID(),
          name: part.informazioniBase.nomePersonaggio,
          imgUrl: part.informazioniBase.urlImmaginePersonaggio,
          initiative: customInitiative ?? Math.floor(Math.random() * 20) + 1 + modDex,
          type: 'character'
        });
      } else {
        const modDex = Math.floor((part.dexterity - 10) / 2);
        encounter.push({
          id: this.randomUID(),
          name: part.name,
          initiative: Math.floor(Math.random() * 20) + 1 + modDex,
          ...part,
          type: 'enemy'
        });
      }
    });
    encounter.sort((a, b) => b.initiative - a.initiative);
    this.dialogRef.close({
      status: 'success',
      encounter: {
        list: encounter,
        started: false,
        activeIndex: 0
      }
    });
  }

  private separateSameNameAddons(addons: any[]): any[] {
    const alphabeth = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const result: any[] = [];

    addons.forEach((addon: any) => {
      for (let i = 0; i < addon.quantity; i++) {
        const name = addon.addon.name + (addon.quantity > 1 ? ` ${alphabeth[i]}` : '');
        result.push({ ...addon.addon, name });
      }
    });
    return result;
  }

  private randomUID() {
    return Math.random().toString(36).substring(2);
  }

}
