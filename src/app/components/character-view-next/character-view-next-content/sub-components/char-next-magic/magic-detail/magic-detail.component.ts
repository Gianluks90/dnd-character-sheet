import { Component, Input } from '@angular/core';
import { Spell } from 'src/app/models/spell';

@Component({
  selector: 'app-magic-detail',
  standalone: false,
  
  templateUrl: './magic-detail.component.html',
  styleUrl: './magic-detail.component.scss'
})
export class MagicDetailComponent {
  public _spell: Spell | null = null;
  @Input() set spell(spell: Spell) {
    if (!spell) return;
    this._spell = spell;
  }
}
