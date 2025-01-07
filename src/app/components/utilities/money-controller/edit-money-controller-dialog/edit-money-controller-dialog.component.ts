import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CharacterService } from 'src/app/services/character.service';

@Component({
    selector: 'app-edit-money-controller-dialog',
    templateUrl: './edit-money-controller-dialog.component.html',
    styleUrl: './edit-money-controller-dialog.component.scss',
    standalone: false
})
export class EditMoneyControllerDialogComponent {
  public form: FormGroup;
  public convertForm: FormGroup;
  private maxWalletValue: number = 0;

  public moneyTypes: any[] = [
    {
      label: 'Rame',
      value: 'MR',
      next: 'MA'
    },
    {
      label: 'Argento',
      value: 'MA',
      next: 'ME'
    },
    {
      label: 'Electrum',
      value: 'ME',
      next: 'MO'
    },
    {
      label: 'Oro',
      value: 'MO',
      next: 'MP'
    },
    {
      label: 'Platino',
      value: 'MP',
      next: null
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMoneyControllerDialogComponent>,
    private charService: CharacterService,
    @Inject(MAT_DIALOG_DATA) public data: { charId: string, denaro: any }) {
    this.form = this.fb.group({
      MP: [0, Validators.min(0)],
      MO: [0, Validators.min(0)],
      ME: [0, Validators.min(0)],
      MA: [0, Validators.min(0)],
      MR: [0, Validators.min(0)],
      advancedForm: false,
    });
    this.convertForm = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required]
    });
  }

  public resetForm(): void {
    this.form.patchValue({
      MP: 0,
      MO: 0,
      ME: 0,
      MA: 0,
      MR: 0
    });
  }

  public addMoney(): void {
    this.data.denaro.MP += this.form.get('MP').value;
    this.data.denaro.MO += this.form.get('MO').value;
    this.data.denaro.ME += this.form.get('ME').value;
    this.data.denaro.MA += this.form.get('MA').value;
    this.data.denaro.MR += this.form.get('MR').value;
    this.charService.updateMoney(this.data.charId, this.data.denaro).then(() => {
      this.resetForm();
    });
  }

  public startingMoney: any = { ...this.data.denaro };
  public warningMessage: boolean = false;
  // public subtractMoney(): void {
  //   const operations = this.getOperationsFromForm();
  //   // const startingMoney = { ...this.data.denaro };
  //   console.log(operations);

  //   let i = 0;
  //   while(operations.length > 0) {
  //     this.warningMessage = false;
  //     if (operations[i].type === 'MP' && operations[i].amount > this.data.denaro.MP) {
  //       this.warningMessage = true;
  //       this.data.denaro = { ...this.startingMoney };
  //       break;
  //     }
  //     if (operations[i].amount <= this.data.denaro[operations[i].type]) {
  //       this.data.denaro[operations[i].type] -= operations[i].amount;
  //       operations.splice(i, 1);
  //     } else {
  //       const currentType = operations[i].type;
  //       const nextType = this.moneyTypes.find(moneyType => moneyType.value === currentType).next;
  //       this.recursiveOneUnitConversion(nextType, currentType);
  //       console.log(currentType, nextType);
        
  //       // operations.splice(i, 1);
  //     }
  //   }
  //   // FINE
  //   this.resetForm();
  // }

  public subtractMoney(): void {
    const operations = this.getOperationsFromForm();
    const startingMoney = { ...this.data.denaro };
    // console.log(operations);
  
    let i = 0;
    while (operations.length > 0 && !this.warningMessage) {
      this.warningMessage = false;
      if (operations[i].type === 'MP' && operations[i].amount > this.data.denaro.MP) {
        this.warningMessage = true;
        this.data.denaro = { ...startingMoney };
        break;
      }
      if (operations[i].amount <= this.data.denaro[operations[i].type]) {
        this.data.denaro[operations[i].type] -= operations[i].amount;
        operations.splice(i, 1);
      } else {
        const currentType = operations[i].type;
        const nextType = this.moneyTypes.find(moneyType => moneyType.value === currentType).next;
        this.recursiveOneUnitConversion(nextType, currentType);
        // console.log(currentType, nextType);
        // Verifica nuovamente se il flag di avvertimento è stato impostato
        // if (this.warningMessage) {
        //   operations.splice(i, 1);
        // }
      }
    }
    // FINE
    this.charService.updateMoney(this.data.charId, this.data.denaro);
    this.resetForm();
  }
  

  private getOperationsFromForm(): { type: string, amount: number }[] {
    const operations: { type: string, amount: number }[] = [];
  
    for (const moneyType of this.moneyTypes) {
      const value = this.form.get(moneyType.value)?.value;
      if (value > 0) {
        operations.push({ type: moneyType.value, amount: value });
      }
    }
    return operations;
  }
  

  private recursiveOneUnitConversion(next: string, current: string): void {
    if (this.data.denaro[next] >= 1) {
      this.data.denaro[next] -= 1;
      this.data.denaro[current] += this.conversionRates[next][current];
    } else {
      const nextType = this.moneyTypes.find(moneyType => moneyType.value === next).next;
      if (nextType) {
        this.recursiveOneUnitConversion(nextType, next);
        this.data.denaro[next] -= 1;
        this.data.denaro[current] += this.conversionRates[next][current];
      } else {
        // Non ci sono abbastanza valori disponibili nella valuta di destinazione
        // Imposta il flag di avvertimento a true
        this.warningMessage = true;
        // Reimposta il denaro allo stato iniziale
        this.data.denaro = { ...this.startingMoney };
        this.resetForm();
      }
    }
  }
  

  // private recursiveOneUnitConversion(next: string, current: string): void {
  //   if (this.data.denaro[next] > 0) {
  //     this.data.denaro[next] -= 1;
  //     this.data.denaro[current] += this.conversionRates[next][current];
  //   } else {
  //     const nextType = this.moneyTypes.find(moneyType => moneyType.value === next).next;
  //     this.recursiveOneUnitConversion(nextType, next);
  //     this.data.denaro[next] -= 1;
  //     this.data.denaro[current] += this.conversionRates[next][current];
  //   }
  // }

  public conversionRates: { [from: string]: { [to: string]: number } } = {
    "MR": { "MA": 0.1, "ME": 0.02, "MO": 0.01, "MP": 0.001 },
    "MA": { "MR": 10, "ME": 0.5, "MO": 0.2, "MP": 0.01 },
    "ME": { "MR": 50, "MA": 5, "MO": 0.1, "MP": 0.05 },
    "MO": { "MR": 100, "MA": 10, "ME": 2, "MP": 0.1 },
    "MP": { "MR": 1000, "MA": 100, "ME": 20, "MO": 10 }
  };

  public invert() {
    const fromValue = this.convertForm.get('from').value;
    const toValue = this.convertForm.get('to').value;

    this.convertForm.patchValue({
      from: toValue,
      to: fromValue
    });
  }

  public converter_dict: { [key: string]: number } = {
    MP: 1000,
    MO: 100,
    ME: 50,
    MA: 10,
    MR: 1,
  };

  public convertMoney(): void {
    const valueFrom = this.data.denaro[this.convertForm.get('from').value];
    const valueTo = this.data.denaro[this.convertForm.get('to').value];
    const rateFrom = this.converter_dict[this.convertForm.get('from').value];
    const rateTo = this.converter_dict[this.convertForm.get('to').value];

    const amountFrom = valueFrom * rateFrom; // Calcoliamo il valore effettivo della valuta di partenza
    const result = Math.floor(amountFrom / rateTo); // Utilizziamo Math.floor per ottenere un numero intero
    const remainder = amountFrom % rateTo; // Otteniamo il resto corretto

    this.data.denaro[this.convertForm.get('from').value] = Math.floor(remainder / rateFrom); // Aggiorniamo il valore della valuta di partenza con il resto convertito nella valuta di partenza
    this.data.denaro[this.convertForm.get('to').value] += result;

    this.convertForm.reset();
    this.charService.updateMoney(this.data.charId, this.data.denaro).then(() => {
      this.convertForm.reset();
    });
  }

  public convertAllToGold(): void {
    const operations = Object.keys(this.data.denaro).map(key => {
      return {
        type: key,
        amount: this.data.denaro[key]
      };
    });
    operations.forEach(operation => {
      if (operation.amount === 0 || operation.type === 'MO') return;
      this.convertForm.patchValue({
        from: operation.type,
        to: 'MO'
      });
      this.convertMoney();
    });
    // this.charService.updateMoney(this.data.charId, this.data.denaro);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
