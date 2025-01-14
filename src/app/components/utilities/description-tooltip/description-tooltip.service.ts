import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescriptionTooltipService {

  constructor() { }

  // COME USARE IL TOOLTIP SERVICE
  // 1. Iniettare, come public, questo service nel costruttore; 
  // 2. Inserire nell'HTML il tag qui sotto:
  // <app-description-tooltip id="*0" info="*1" *ngIf="tooltip.show && tooltip.id === *0" [ngStyle]="{'top.px': tooltip.tooltipPosition.top, 'left.px': tooltip.tooltipPosition.left}"></app-description-tooltip>
  // 3. Nello stesso componente in cui è stato inserito il tag aggiungere nel punto che si desidera far comparire il tooltip:
  // (mouseover)="tooltip.showTooltip($event, *2, *3, *0, *4)" (mouseleave)="tooltip.hideTooltip()"
  //
  // Note:
  // *0 = id del tooltip da usare nel getDocumentById;
  // *1 = Chiave dell'oggetto "infos" che contiene il titolo e la descrizione del tooltip;
  // *2 = Posizione del tooltip (left, right, center). Center posiziona il tooltip leggermente in basso;
  // *3 = Condizione che se true ignora la comparsa del tooltip;
  // *4 = Condizione (opzionale) che se true posiziona il tooltip a metà della distanza, funziona solo con positione 'center';

  public show: boolean = false;
  public id: string = '';
  public tooltipPosition: { top: number | string, left: number | string } = { top: 0, left: 0 };

  public showTooltip(event: MouseEvent, position: string, ignore: boolean, id: string, near?: boolean) {

    this.id = id;
    
    if (!ignore) return;
    let positionModifier: number = 0;
    let verticalAdjustment: number = 0; // Aggiunta per l'aggiustamento verticale per la posizione "center"
    switch (position) {
      case 'left':
        positionModifier = -135;
        break;
      case 'right':
        positionModifier = 135;
        break;
      case 'center':
        positionModifier = 0;
        verticalAdjustment = near ? 50 : 100; // Imposta un aggiustamento verticale per la posizione "center"
        break;
      case 'up':
        positionModifier = 0;
        verticalAdjustment = near ? -50 : -100;
        break;
      case 'up-left':
        positionModifier = -135;
        verticalAdjustment = near ? -50 : -100;
        break;
      case 'up-right':
        positionModifier = 135;
        verticalAdjustment = near ? -50 : -100;
        break;
    }
    if (window.innerWidth < 768) return;
    this.show = true;
    setTimeout(() => {
      const tooltip = document.getElementById(this.id) as HTMLElement;
      console.log('tooltip', tooltip);
      
      if (!tooltip) return;
      console.log('tooltip', tooltip);
      
      const rect = tooltip.getBoundingClientRect();
      if (event.clientY + rect.height > window.innerHeight) {
        this.tooltipPosition = { top: window.innerHeight + 50 - rect.height, left: event.clientX + positionModifier };
      } else {
        this.tooltipPosition = { top: event.clientY + verticalAdjustment, left: event.clientX + positionModifier };
      }
    }, 1);
    // this.tooltipPosition = { top: event.clientY, left: event.clientX-175};
  }
  

  public hideTooltip() {
    this.show = false;
  }
}
