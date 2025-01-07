import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-archive-achievement-dialog',
    templateUrl: './archive-achievement-dialog.component.html',
    styleUrl: './archive-achievement-dialog.component.scss',
    standalone: false
})
export class ArchiveAchievementDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { archive: any }) {}
}
