import { Component, Input } from '@angular/core';

interface Skill {
  label: string;
  value: string;
  modifier: number;
  save: boolean;
}

@Component({
  selector: 'app-skill-container',
  standalone: false,
  templateUrl: './skill-container.component.html',
  styleUrl: './skill-container.component.scss'
})
export class SkillContainerComponent {
  private skillsOrder = ['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'];
  public skills: Skill[] = [];
  public proficiencyBonus = 2;

  @Input() set char(char: any) {
    this.proficiencyBonus = char.tiriSalvezza.bonusCompetenza;
    const unorderedSkills = [];
    for (const key in char.caratteristiche) {
      if (Object.prototype.hasOwnProperty.call(char.caratteristiche, key)) {
        unorderedSkills.push({
          label: key,
          value: char.caratteristiche[key],
          save: char.tiriSalvezza[key],
          modifier: Math.floor((char.caratteristiche[key] - 10) / 2)
        });
      }
    }
    this.skills = unorderedSkills.sort((a, b) => {
      return this.skillsOrder.indexOf(a.label) - this.skillsOrder.indexOf(b.label);
    });
  }
}
