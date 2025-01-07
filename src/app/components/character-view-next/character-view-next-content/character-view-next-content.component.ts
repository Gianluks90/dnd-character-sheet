import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-view-next-content',
  standalone: false,
  templateUrl: './character-view-next-content.component.html',
  styleUrl: './character-view-next-content.component.scss'
})
export class CharacterViewNextContentComponent {

  public characterData: any;
  @Input() set character(character: any) {
    this.characterData = character;
  }
}
