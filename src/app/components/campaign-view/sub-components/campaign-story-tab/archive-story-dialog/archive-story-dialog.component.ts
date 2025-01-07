import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-archive-story-dialog',
    templateUrl: './archive-story-dialog.component.html',
    styleUrl: './archive-story-dialog.component.scss',
    standalone: false
})
export class ArchiveStoryDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { archive: any }) {
    // data.archive = data.archive.reverse();
    this.data.archive.forEach(element => {
      element.story = element.story.reverse();
    });
  }

}
