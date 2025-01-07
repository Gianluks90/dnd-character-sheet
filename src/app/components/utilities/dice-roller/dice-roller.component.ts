import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-dice-roller',
    templateUrl: './dice-roller.component.html',
    styleUrls: ['./dice-roller.component.scss'],
    standalone: false
})
export class DiceRollerComponent {

  public form: FormGroup | null = null;

  public diceResult: number = 0;
  private diceCounts: { [key: string]: number } = {};
  private modifier: number = 0;
  public isCampaignOwner: boolean = false;
  public isCampaign: boolean = false;
  public criticalMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DiceRollerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { formula: string, extra: string, char: any },
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      diceFormula: ['', Validators.required],
      advDis: [''],
      isHidden: [false],
      rollOnCampaign: [false]
    });

    if (data && data.formula) {
      this.parseFormula(data.formula);
    }
    if ((data && !data.char) && window.location.href.includes('campaign-view')) {
      this.isCampaignOwner = true;
    }
    if (data && data.char && data.char.campaignId !== '') {
      this.form?.get('rollOnCampaign')?.setValue(true);
    }
    this.isCampaign = window.location.href.includes('campaign-view');
  }

  private parseFormula(formula: string): void {
    const diceRegex = /(\d*)d(\d+)/g;
    let match;

    while ((match = diceRegex.exec(formula)) !== null) {
      const count = parseInt(match[1], 10) || 1;
      const type = match[2];
      this.diceCounts[type] = (this.diceCounts[type] || 0) + count;
    }

    const modifierMatch = formula.match(/[+-]\d+$/);
    if (modifierMatch) {
      this.modifier = parseInt(modifierMatch[0], 10);
    }

    this.updateFormula();
  }

  private updateFormula(): void {
    let formulaParts = [];
    const advDis = this.form?.get('advDis')?.value;
    if (advDis === 'adv') {
      formulaParts.push('1d20A');
    } else if (advDis === 'dis') {
      formulaParts.push('1d20D');
    }

    for (const [type, count] of Object.entries(this.diceCounts)) {
      if (count > 0) {
        formulaParts.push(`${count > 1 ? count : '1'}d${type}`);
      }
    }

    let formula = formulaParts.join('+');
    if (this.modifier !== 0) {
      formula += `${this.modifier > 0 ? '+' : ''}${this.modifier}`;
    }
    this.form?.get('diceFormula')?.setValue(formula);
  }

  public roll(): void {
    const formula = this.form?.get('diceFormula')?.value;
    let result: number;
    const advDis = this.form?.get('advDis')?.value;

    if (advDis === 'adv') {
      result = this.rollWithAdvantageOrDisadvantage(formula.replace('1d20A', ''), 'adv');
    } else if (advDis === 'dis') {
      result = this.rollWithAdvantageOrDisadvantage(formula.replace('1d20D', ''), 'dis');
    } else {
      result = this.rollDice(formula);
    }

    this.animateResult(result);
    this.clear();
  }

  // private rollDice(formula: string): number {
  //   const diceRegex = /(\d*)d(\d+)|([+-]\d+)/g;
  //   let match;
  //   let total = 0;

  //   while ((match = diceRegex.exec(formula)) !== null) {
  //     if (match[2]) {
  //       const numDice = parseInt(match[1], 10) || 1;
  //       const diceType = parseInt(match[2], 10);
  //       for (let i = 0; i < numDice; i++) {
  //         total += Math.floor(Math.random() * diceType) + 1;
  //       }
  //     } else if (match[3]) {
  //       total += parseInt(match[3], 10);
  //     }
  //   }

  //   return total;
  // }

  private rollDice(formula: string): number {
    const diceRegex = /(\d*)d(\d+)|([+-]\d+)/g;
    let match;
    let total = 0;
  
    this.criticalMessage = ''; // Reset the critical message
  
    while ((match = diceRegex.exec(formula)) !== null) {
      if (match[2]) {
        const numDice = parseInt(match[1], 10) || 1;
        const diceType = parseInt(match[2], 10);
        for (let i = 0; i < numDice; i++) {
          const roll = Math.floor(Math.random() * diceType) + 1;
          total += roll;
          // Check for critical success or failure
          if (diceType === 20) {
            if (roll === 20) {
              this.criticalMessage = 'Successo Critico';
            } else if (roll === 1) {
              this.criticalMessage = 'Fallimento Critico';
            }
          }
        }
      } else if (match[3]) {
        total += parseInt(match[3], 10);
      }
    }
  
    return total;
  }

  // private rollWithAdvantageOrDisadvantage(formula: string, advDis: string): number {
  //   const d20Rolls = [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1];
  //   const d20Result = advDis === 'adv' ? Math.max(...d20Rolls) : Math.min(...d20Rolls);

  //   let total = d20Result;
  //   const diceRegex = /(\d*)d(\d+)|([+-]\d+)/g;
  //   let match;

  //   while ((match = diceRegex.exec(formula)) !== null) {
  //     if (match[2] && match[2] !== '20') {
  //       const numDice = parseInt(match[1], 10) || 1;
  //       const diceType = parseInt(match[2], 10);
  //       for (let i = 0; i < numDice; i++) {
  //         total += Math.floor(Math.random() * diceType) + 1;
  //       }
  //     } else if (match[3]) {
  //       total += parseInt(match[3], 10);
  //     }
  //   }

  //   return total;
  // }

  private rollWithAdvantageOrDisadvantage(formula: string, advDis: string): number {
    const d20Rolls = [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1];
    const d20Result = advDis === 'adv' ? Math.max(...d20Rolls) : Math.min(...d20Rolls);
  
    this.criticalMessage = ''; // Reset the critical message
  
    if (d20Result === 20) {
      this.criticalMessage = 'Successo Critico';
    } else if (d20Result === 1) {
      this.criticalMessage = 'Fallimento Critico';
    }
  
    let total = d20Result;
    const diceRegex = /(\d*)d(\d+)|([+-]\d+)/g;
    let match;
  
    while ((match = diceRegex.exec(formula)) !== null) {
      if (match[2] && match[2] !== '20') {
        const numDice = parseInt(match[1], 10) || 1;
        const diceType = parseInt(match[2], 10);
        for (let i = 0; i < numDice; i++) {
          total += Math.floor(Math.random() * diceType) + 1;
        }
      } else if (match[3]) {
        total += parseInt(match[3], 10);
      }
    }
  
    return total;
  }

  private animateResult(result: number): void {
    const duration = 500; // Durata dell'animazione in millisecondi
    const stepTime = 30; // Tempo in millisecondi per ogni incremento
    const steps = duration / stepTime;
    let currentStep = 0;
    let currentValue = 0;

    const increment = result / steps;
    const interval = setInterval(() => {
      currentStep++;
      currentValue += increment;
      this.diceResult = Math.round(currentValue);

      if (currentStep >= steps) {
        clearInterval(interval);
        this.diceResult = result; // Assicurati che il risultato finale sia esatto
      }
    }, stepTime);
    const audio = new Audio('./assets/sounds/dice-roll.mp3');
    audio.play();
    this.notify(result);
  }

  public addDice(dice: string): void {
    const diceType = dice.replace('d', '');
    this.diceCounts[diceType] = (this.diceCounts[diceType] || 0) + 1;
    this.updateFormula();
  }

  public addModifier(mod: number): void {
    this.modifier += mod;
    this.updateFormula();
  }

  public notify(result: number): void {
    // SE Campagna
    if (window.location.href.includes('campaign-view')) {
      if (this.data.char) {
        this.notificationService.newLog(window.location.href.split('/').pop(), {
          message: `${this.data.char.informazioniBase.nomePersonaggio} ha tirato ${this.form?.get('diceFormula')?.value}, ottenendo ${result}${(this.data.extra && this.data.extra !== '') ? ' in '+this.data.extra : ''}.`,
          type: 'text-image',
          imageUrl: this.data.char.informazioniBase.urlImmaginePersonaggio
        });
      }
      if (this.isCampaignOwner && !this.form?.get('isHidden')?.value) {
        this.notificationService.newLog(window.location.href.split('/').pop(), {
          message: `Il DM ha tirato ${this.form?.get('diceFormula')?.value}, ottenendo ${result}.`,
          type: 'text-casino'
        });
      }
    }
    // SE Scheda Personaggio
    if (this.form?.get('rollOnCampaign')?.value) {
      this.notificationService.newLog(this.data.char.campaignId, {
        message: `${this.data.char.informazioniBase.nomePersonaggio} ha tirato ${this.form?.get('diceFormula')?.value}, ottenendo ${result}${(this.data.extra && this.data.extra !== '') ? ' in '+ this.data.extra : ''}.`,
        type: 'text-image',
        imageUrl: this.data.char.informazioniBase.urlImmaginePersonaggio
      });
    
    }
  }

  public clear(): void {
    this.diceCounts = {};
    this.modifier = 0;
    this.form?.get('advDis')?.setValue('');
    this.updateFormula();
  }
}