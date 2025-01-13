import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiceRollerComponent } from 'src/app/components/utilities/dice-roller/dice-roller.component';

@Component({
  selector: 'app-char-next-skill',
  standalone: false,
  
  templateUrl: './char-next-skill.component.html',
  styleUrl: './char-next-skill.component.scss'
})
export class CharNextSkillComponent {
    public characterData: any;
    public saveThrows: any[] = [];
    public showAllSaveThrows: boolean = false;
    public showAllSkills: boolean = false;

    constructor(private matDialog: MatDialog) {}

    @Input() set char(character: any) {
      this.characterData = character;
      console.log('character status', character);
      this.setupStatus();
    }
  
    public editModeData: boolean = false;
    @Input() set edit(editMode: boolean) {
      this.editModeData = editMode;
    }

    private setupStatus(): void {
      this.initSaveThrows();
    }

    private initSaveThrows(): void {
      this.saveThrows = [];
      const parameters = ['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'];
      const proficiencyBonus: number = this.characterData.tiriSalvezza.bonusCompetenza;
      parameters.forEach((p) => {
        this.saveThrows.push({
          proficient: this.characterData.tiriSalvezza[p],
          label: p,
          value: this.characterData.tiriSalvezza[p] ? Math.floor((this.characterData.caratteristiche[p] - 10) / 2) + proficiencyBonus : Math.floor((this.characterData.caratteristiche[p] - 10) / 2)
        });
      });
    }

    public toggleSaveThrows(): void {
      this.showAllSaveThrows = !this.showAllSaveThrows;
    }

    public toggleSkills(): void {
      this.showAllSkills = !this.showAllSkills;
    }

    public openDiceRoller(formula?: string, extra?: string) {
        this.matDialog.open(DiceRollerComponent, {
          width: window.innerWidth < 768 ? '90%' : '500px',
          autoFocus: false,
          backdropClass: 'as-dialog-backdrop',
          disableClose: true,
          data: {
            char: this.characterData,
            formula: formula || '',
            extra: extra || ''
          }
        });
      }
}
