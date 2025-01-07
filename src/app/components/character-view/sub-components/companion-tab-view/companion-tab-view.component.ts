import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-companion-tab-view',
    templateUrl: './companion-tab-view.component.html',
    styleUrl: './companion-tab-view.component.scss',
    standalone: false
})
export class CompanionTabViewComponent {

  public charData: any;

  constructor() { }

  @Input() set character(character: any) {
    this.charData = character;
  }
}
