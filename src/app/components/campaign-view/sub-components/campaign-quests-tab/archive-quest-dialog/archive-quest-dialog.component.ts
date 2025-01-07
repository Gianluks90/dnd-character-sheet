import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-archive-quest-dialog',
    templateUrl: './archive-quest-dialog.component.html',
    styleUrl: './archive-quest-dialog.component.scss',
    standalone: false
})
export class ArchiveQuestDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { archive: any }) {
    this.data.archive.forEach(element => {
      if (!element.quest) return;
      element.quest = element.quest.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    });
  }
}
