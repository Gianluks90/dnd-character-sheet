import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NPC, NPCCategory, NPCRelationship } from 'src/app/models/npcModel';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-add-organization-dialog',
    templateUrl: './add-organization-dialog.component.html',
    styleUrl: './add-organization-dialog.component.scss',
    standalone: false
})
export class AddOrganizationDialogComponent {

  public form: FormGroup = this.fb.group(NPC.createOrganization(this.fb));
  public relationships = [NPCRelationship.FRIEND, NPCRelationship.NEUTRAL, NPCRelationship.INDIFFERENT, NPCRelationship.OSTILE];
  public isCampaign: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { organizations: any[], organization?: any },
    private dialogRef: MatDialogRef<AddOrganizationDialogComponent>,
    private fb: FormBuilder,
    private notification: NotificationService,
    private formService: FormService) { }

  ngOnInit() {
    if (this.data.organization) {
      this.form.patchValue(this.data.organization);
    }
    this.form.get('category').setValue(NPCCategory.ORGANIZATION);
    this.isCampaign = window.location.href.includes('campaign-view') || false;
    this.form.get('visible').setValue(!this.isCampaign);
    
  }

  confirm() {
    if (this.data.organization) {
      this.dialogRef.close({
        status: 'edited',
        organization: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        organization: this.form.value
      })
    }
  }

  delete() {
    if (this.data.organization) {
      this.dialogRef.close({
        status: 'deleted',
        spell: this.form.value
      })
    }
  }

  public onPicSelected(event: any) {
    if (event.target.files[0].size > 100000) {
      // this.notification.openSnackBar('Immagine troppo grande, dim. massima: 100kb.', 'warning', 3000, 'yellow');
    } else {
      this.formService.uploadNPCImage(event, this.form.get('name').value).then((result) => {
        if (result !== 'error') {
          this.form.patchValue({
            imgUrl: result.url,
            imgName: result.name,
          });
        } else {
          // this.notification.openSnackBar('Errore nel caricamento dell\'immagine', 'error');
        }
      })
    }
    (<HTMLInputElement>document.getElementById("file")).value = null;
  }

  public deletePic(nomeImmagine: string) {
    this.formService.deleteImage(nomeImmagine).then((result) => {
      if (result === 'success') {
        this.form.patchValue({
          imgUrl: '',
          imgName: '',
        });
      }
    });
  }
}

