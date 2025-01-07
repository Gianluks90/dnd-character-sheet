import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NPC } from 'src/app/models/npcModel';

@Component({
    selector: 'app-add-organizations-resources-dialog',
    templateUrl: './add-organizations-resources-dialog.component.html',
    styleUrl: './add-organizations-resources-dialog.component.scss',
    standalone: false
})
export class AddOrganizationsResourcesDialogComponent {
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: { organizations: NPC[] }, 
    private dialogRef: MatDialogRef<AddOrganizationsResourcesDialogComponent>) { }

  public form: FormGroup = this.fb.group({
    orgs: [],
  });

  public confirm() {
    this.dialogRef.close({
      orgs: this.form.value.orgs
    })
  }
}
