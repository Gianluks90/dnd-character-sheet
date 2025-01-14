import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DiceRollerComponent } from 'src/app/components/utilities/dice-roller/dice-roller.component';
import { SkillTooltipComponent } from 'src/app/components/utilities/skill-tooltip/skill-tooltip.component';

@Component({
  selector: 'app-char-next-skill',
  standalone: false,
  templateUrl: './char-next-skill.component.html',
  styleUrl: './char-next-skill.component.scss'
})
export class CharNextSkillComponent {
  public characterData: any;
  public saveThrows: any[] = [];
  public passiveSkills: any[] = [];
  public showAllSaveThrows: boolean = false;
  public showAllSkills: boolean = false;

  private tooltipRef: ComponentRef<SkillTooltipComponent> | null = null;
  
  constructor(
    private matDialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  @Input() set char(character: any) {
    this.characterData = character;
    setTimeout(() => {
      this.setupStatus();
    }, 100);
  }

  public editModeData: boolean = false;
  @Input() set edit(editMode: boolean) {
    this.editModeData = editMode;
  }

  private setupStatus(): void {
    this.initSaveThrows();
    this.initPassiveSkill();
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

  private initPassiveSkill(): void {
    this.passiveSkills = [];
    const passives: string[] = ['percezione', 'intuizione', 'indagare'];
    const proficiencyBonus: number = this.characterData.tiriSalvezza.bonusCompetenza;
    this.characterData.competenzaAbilita.forEach((a) => {
      if (passives.includes(a.label)) {
        const skill = a.label === 'indagare' ? 'intelligenza' : 'saggezza';  
        this.passiveSkills.push({
          label: a.label,
          value: 10 + Math.floor((this.characterData.caratteristiche[skill] - 10) / 2) + (a.proficient ? proficiencyBonus : 0) + (a.mastered ? proficiencyBonus : 0)
        });
        this.passiveSkills.sort((a, b) => a.label.localeCompare(b.label));
      }
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

  public currentTooltipItem: any;
  public showItemTooltip: boolean = false;
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, skill: any) {
    if (window.innerWidth < 768) return;
    this.removeTooltip();
    const factory = this.componentFactoryResolver.resolveComponentFactory(SkillTooltipComponent);
    this.tooltipRef = factory.create(this.injector);
    const tooltipElement = this.tooltipRef.location.nativeElement;
    tooltipElement.classList.add('dynamic-tooltip');
    this.tooltipRef.instance._skill = skill;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const tooltipPosition = {
      top: event.clientY + rect.height > window.innerHeight
        ? window.innerHeight - rect.height - 10
        : event.clientY,
      left: event.clientX + 175,
    };
    tooltipElement.style.top = `${tooltipPosition.top}px`;
    tooltipElement.style.left = `${tooltipPosition.left}px`;
    this.appRef.attachView(this.tooltipRef.hostView);
    const domElem = (this.tooltipRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  public hideTooltip() {
    this.removeTooltip();
  }
  
  private removeTooltip() {
    if (this.tooltipRef) {
      this.appRef.detachView(this.tooltipRef.hostView);
      this.tooltipRef.destroy();
      this.tooltipRef = null;
    }
  }
}
