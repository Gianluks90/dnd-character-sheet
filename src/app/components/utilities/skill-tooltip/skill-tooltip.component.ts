import { Component, Input } from '@angular/core';

interface SkillTooltipInfo {
  param: string;
  label: string;
  modifier: number;
  proficient: boolean;
  mastered: boolean;
  description: string;
}

@Component({
  selector: 'app-skill-tooltip',
  standalone: false,

  templateUrl: './skill-tooltip.component.html',
  styleUrl: './skill-tooltip.component.scss'
})
export class SkillTooltipComponent {
  constructor() { }

  public _skill: SkillTooltipInfo;
  @Input() set skill(skill: any) {
    this._skill = skill;
  }
}
