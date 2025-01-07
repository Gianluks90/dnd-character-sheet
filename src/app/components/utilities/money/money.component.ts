import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharacterService } from 'src/app/services/character.service';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-money',
    templateUrl: './money.component.html',
    styleUrls: ['./money.component.scss'],
    standalone: false
})
export class MoneyComponent {

  public group: FormGroup | null = null;
  public form: FormGroup = this.fb.group({
    value: [null, [Validators.required, Validators.min(1)]],
    type: [null, [Validators.required]]
  });

  public tipiMonete: string[] = [
    'Rame (MR)',
    'Argento (MA)',
    'Electrum (ME)',
    'Oro (MO)',
    'Platino (MP)',
  ];

  public converter_dict: { [key: string]: number } = {
    MP: 1000,
    MO: 100,
    ME: 50,
    MA: 10,
    MR: 1,
  };

  constructor(public formService: FormService, private notificationService: NotificationService, private fb: FormBuilder, private charService: CharacterService) {
    this.group = this.fb.group({
      MP: [0, Validators.min(0)],
      MO: [0, Validators.min(0)],
      ME: [0, Validators.min(0)],
      MA: [0, Validators.min(0)],
      MR: [0, Validators.min(0)]
    });
   }

  @Input() public set denaro(denaro: any) {
      this.group.get('MP').setValue(denaro.MP);
      this.group.get('MO').setValue(denaro.MO);
      this.group.get('ME').setValue(denaro.ME);
      this.group.get('MA').setValue(denaro.MA);
      this.group.get('MR').setValue(denaro.MR);
  }

  public charId: string = '';
  @Input() public set id(id: string) {
    this.charId = id;
  }

  public converti(valore: number, da: string, a: string): number {
    return (valore * this.converter_dict[da]) / this.converter_dict[a];
  }

  public minimise_bag(valori_dict: { [key: string]: number }) {
    let return_dict = {};
    let min_bag = 0;
    for (let [k, v] of Object.entries(valori_dict)) {
      min_bag += this.converti(v, k, 'rame');
    }
    for (let entry of Object.entries(this.converter_dict)) {
      const true_div = min_bag / entry[1];
      return_dict[entry[0]] = Math.floor(true_div);
      min_bag = min_bag % entry[1];
    }
    return return_dict;
  }

  public add_subtract(valori_dict: string, valori_dict2: number, what: string) {
    let return_dict = {};
    let min_bag = 0;
    let min_bag2 = 0;
    let totale = 0;
    let taglioMoneta = this.cambioTaglio(valori_dict);
    let start_bag: { [key: string]: number } = this.group.value;

    for (let [k, v] of Object.entries(start_bag)) {
      if (v > 0) {
        min_bag += this.converti(v, k, 'MR');
      }
    }
    for (let [k, v] of Object.entries({ [taglioMoneta]: valori_dict2 })) {
      min_bag2 += this.converti(v, k, 'MR');
    }
    if (what == 'add') {
      totale = min_bag + min_bag2;
    } else {
      totale = min_bag - min_bag2;
    }

    for (let entry of Object.entries(this.converter_dict)) {
      const true_div = totale / entry[1];
      return_dict[entry[0]] = Math.floor(true_div);
      totale = totale % entry[1];
    }
    this.addToPreviousBag(return_dict);
    this.form.reset();
    this.charService.updateMoney(this.charId, this.group.value);
    // return return_dict;
  }

  public addToPreviousBag(bagToAdd: any) {
    if (bagToAdd.MP >= 0 && bagToAdd.MO >= 0 && bagToAdd.ME >= 0 && bagToAdd.MA >= 0 && bagToAdd.MR >= 0) {
      this.group.get('MP').setValue(bagToAdd.MP);
      this.group.get('MO').setValue(bagToAdd.MO);
      this.group.get('ME').setValue(bagToAdd.ME);
      this.group.get('MA').setValue(bagToAdd.MA);
      this.group.get('MR').setValue(bagToAdd.MR);
    } else {
      // this.notificationService.openSnackBar("Non hai abbastanza monete per farlo!", 'toll', 3000, 'red');
    }
  }

  public cambioTaglio(taglio): string {
    switch (taglio) {
      case 'Platino (MP)':
        return 'MP';

      case 'Oro (MO)':
        return 'MO';

      case 'Electrum (ME)':
        return 'ME';

      case 'Argento (MA)':
        return 'MA';

      case 'Rame (MR)':
        return 'MR';

      default:
        return '';
    }
  }
}
