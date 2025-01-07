import { Component, Inject } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdventurerUser } from 'src/app/models/adventurerUser';

@Component({
    selector: 'app-manage-resources-dialog',
    templateUrl: './manage-resources-dialog.component.html',
    styleUrl: './manage-resources-dialog.component.scss',
    standalone: false
})
export class ManageResourcesDialogComponent {
  constructor(private resService: ResourcesService, @Inject(MAT_DIALOG_DATA) public data: { user: AdventurerUser }) { }

  deleteAll(): void {
    this.resService.resourceReset(this.data.user.id);
  }

  deleteResource(type: string): void {
    this.resService.resourceResetByType(this.data.user.id, type);
  }
}
