import { Component, Inject, Input } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
    selector: 'app-character-bottom-sheet',
    templateUrl: './character-bottom-sheet.component.html',
    styleUrl: './character-bottom-sheet.component.scss',
    standalone: false
})
export class CharacterBottomSheetComponent {

  public charIdData: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { id: string }) {
    this.charIdData = data.id;
  }
}
