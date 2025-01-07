import { Component, effect } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';

export interface Character {
  name: string;
  id: string;
}

@Component({
    selector: 'app-ticket-campaign-dialog',
    templateUrl: './ticket-campaign-dialog.component.html',
    styleUrl: './ticket-campaign-dialog.component.scss',
    standalone: false
})
export class TicketCampaignDialogComponent {

  public user: AdventurerUser | null;
  public checked: boolean = false;
  public characters: Character[] = [];

  public campForm = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(1)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
  });

  public charForm = this.fb.group({
    selected: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder, 
    public dialogRef: MatDialogRef<TicketCampaignDialogComponent>, 
    private campaignService: CampaignService, 
    private characterService: CharacterService, 
    private router: Router, 
    private firebaseService: FirebaseService) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
    });
  }

  public checkForm() {
    this.campaignService.checkCampaign(this.campForm.value.id, this.campForm.value.password).then((result) => {
      if (result) {
        this.checked = true;
        this.characterService.getCharactersByUserId(this.user.id).then((result) => {
          result.map((character) => {
            // if (character.campaignId !== '') return;
            if (character.campaign.id !== '') return;
            this.characters.push({
              name: character.informazioniBase.nomePersonaggio,
              id: character.id
            });
          });
        });
      } else {
        this.campForm.controls.id.setErrors({ 'incorrect': true });
        this.campForm.controls.password.setErrors({ 'incorrect': true });
      }
    });
  }

  public confirm(): void {
    const charId = this.charForm.value.selected;
    this.campaignService.subscribeToCampaign(this.campForm.value.id, this.user.id, charId).then(() => {
      this.dialogRef.close({
        status: 'success'
      });
    });
  }

  public cancel(): void {
    const url = window.location.href.split('/');
    if (url.includes('campaign-view')) {
      this.router.navigate(['campaigns']);
      this.dialogRef.close();
    } else {
      this.dialogRef.close();
    }
  }

}
