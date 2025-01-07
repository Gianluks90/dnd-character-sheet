import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NPC, NPCCategory, NPCRelationship } from 'src/app/models/npcModel';
import { FormService } from 'src/app/services/form.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-add-npc-dialog',
    templateUrl: './add-npc-dialog.component.html',
    styleUrl: './add-npc-dialog.component.scss',
    standalone: false
})
export class AddNpcDialogComponent {

  public form: FormGroup = this.fb.group(NPC.create(this.fb));
  public relationships = [NPCRelationship.FRIEND, NPCRelationship.NEUTRAL, NPCRelationship.INDIFFERENT, NPCRelationship.OSTILE];
  public traits: FormArray;
  public actions: FormArray;
  public isCampaign: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { npcs: any[], npc?: any, isTab?: boolean},
    private dialogRef: MatDialogRef<AddNpcDialogComponent>,
    private fb: FormBuilder,
    private notification: NotificationService,
    private formService: FormService) {
    this.traits = this.fb.array([]);
    this.traits = this.form.controls['traits'] as FormArray;
    this.actions = this.fb.array([]);
    this.actions = this.form.controls['actions'] as FormArray;
    this.form.get('visible').setValue(false);
    this.isCampaign = window.location.href.includes('campaign-view') || false;
  }

  ngOnInit() {
    if (this.data.npc) {
      this.form.patchValue(this.data.npc);
      this.data.npc.traits.forEach((trait: any) => {
        this.traits.push(this.fb.group(trait));
      });
      this.data.npc.actions.forEach((action: any) => {
        this.actions.push(this.fb.group(action));
      });
    }

    this.form.get('category').setValue(this.data.isTab ? NPCCategory.ADDON : NPCCategory.ALLY);
    this.form.get('parameterRequired').valueChanges.subscribe((value: boolean) => {
      this.setValidators(value);
    });
    this.form.get('HPmax').valueChanges.subscribe((value: number) => {
      this.form.get('HP').setValue(value);
    });

  }

  confirm() {
    if (this.data.npc) {
      this.dialogRef.close({
        status: 'edited',
        npc: this.form.value
      })
    } else {
      this.dialogRef.close({
        status: 'success',
        npc: this.form.value
      })
    }
  }

  delete() {
    if (this.data.npc) {
      this.dialogRef.close({
        status: 'deleted',
        npc: this.form.value
      })
    }
  }

  private setValidators(value: boolean) {
    const fields = ['CA', 'speed', 'HPmax', 'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    fields.forEach(field => {
      const control = this.form.get(field);
      if (control) {
        if (value) {
          control.setValidators([Validators.required]);
          control.updateValueAndValidity();
        } else {
          control.clearValidators();
          control.updateValueAndValidity();
        }
      }
    });
  }

  public addTrait() {
    const trait = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.traits.push(trait);
  }

  public deleteTrait(index: number) {
    this.traits.removeAt(index);
  }

  public addAction() {
    const action = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.actions.push(action);
  }

  public deleteAction(index: number) {
    this.actions.removeAt(index);
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
      } else {
        this.form.patchValue({
          imgUrl: '',
          imgName: '',
        });
      }
    });
  }
}
