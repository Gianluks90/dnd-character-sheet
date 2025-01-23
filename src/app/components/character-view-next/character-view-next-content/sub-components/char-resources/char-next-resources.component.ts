import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddResourceDialogComponent } from 'src/app/components/character-view/sub-components/character-view-status/add-resource-dialog/add-resource-dialog.component';
import { ConditionDialogComponent } from 'src/app/components/utilities/conditions/condition-dialog/condition-dialog.component';
import { ConditionInfoDialogComponent } from 'src/app/components/utilities/conditions/condition-info-dialog/condition-info-dialog.component';
import { ResourceTooltipComponent } from 'src/app/components/utilities/resource-tooltip/resource-tooltip.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-next-char-resources',
  standalone: false,
  templateUrl: './char-next-resources.component.html',
  styleUrl: './char-next-resources.component.scss'
})
export class CharNextResourcesComponent {

  private tooltipRef: ComponentRef<ResourceTooltipComponent> | null = null;

  constructor(
    private matDialog: MatDialog,
    private charService: CharacterService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  public _char: any;
  @Input() set char(character: any) {
    this._char = character;
    console.log('CharNextResourcesComponent: ', this._char);

    setTimeout(() => {
      this.setupResources();
    }, 100);
  }

  public _edit: boolean = false;
  @Input() set edit(editMode: boolean) {
    this._edit = editMode;
  }

  private setupResources(): void { }

  public newCondition(): void {
    this.matDialog.open(ConditionDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        characters: [this._char]
      }
    });
  }

  public conditionInfo(condition: any): void {
    this.matDialog.open(ConditionInfoDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '500px',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        condition: condition
      }
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'delete') {
        const charConditions = this._char.parametriVitali.conditions;
        const index = charConditions.findIndex((c: any) => c.name === condition.name);
        if (index > -1) {
          charConditions.splice(index, 1);
          this.charService.updateCharacterConditions(this._char.id, charConditions);
        }
      }
    });
  }

  public toggleInspiration(): void {
    this.charService.updateInspiration(this._char.id, !this._char.ispirazione);
  }

  public addResource(): void {
    this.matDialog.open(AddResourceDialogComponent, {
      width: innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      backdropClass: 'as-dialog-backdrop',
      data: {
        charId: this._char.id
      }
    })
  }

  public resourceAction(action: 'add' | 'remove', index: number): void {
    const resource = this._char.informazioniBase.risorseAggiuntive[index];
    if (action === 'add') {
      resource.value + 1 > resource.max ? resource.value = resource.max : resource.value += 1;
    } else {
      resource.value - 1 < 0 ? resource.value = 0 : resource.value -= 1;
      if (resource.value === 0 && resource.automaticResolv && resource.isTemporary) {
        this.deleteResource(index);
      }
    }
    this.charService.updateAdditionalResources(this._char.id, this._char.informazioniBase.risorseAggiuntive);
  }

  public deleteResource(index: number): void {
    this._char.informazioniBase.risorseAggiuntive.splice(index, 1);
    this.charService.updateAdditionalResources(this._char.id, this._char.informazioniBase.risorseAggiuntive);
  }

  // TOOLTIP

  public currentTooltipItem: any;
    public showItemTooltip: boolean = false;
    public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };
  
    public showTooltip(event: MouseEvent, resource: any) {
      if (window.innerWidth < 768) return;
      this.removeTooltip();
      const factory = this.componentFactoryResolver.resolveComponentFactory(ResourceTooltipComponent);
      this.tooltipRef = factory.create(this.injector);
      const tooltipElement = this.tooltipRef.location.nativeElement;
      tooltipElement.classList.add('dynamic-tooltip');
      this.tooltipRef.instance._resource = resource;
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
