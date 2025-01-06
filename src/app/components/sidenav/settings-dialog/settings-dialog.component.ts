import { Component, Inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdventurerUser, Role } from 'src/app/models/adventurerUser';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.scss'
})
export class SettingsDialogComponent {

  public activationCode: string = "";
  private activationResult: any = null;
  public isAdmin: boolean = false;

  public form: FormGroup = this.fb.group({
    rollTheme: ['dungeonscompanion2023-enemy-lp882vo8', Validators.required],
  });

  public user: AdventurerUser | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { dddiceToken: string, privateSlug: string },
    private firebaseService: FirebaseService,
    private characterService: CharacterService,
    private campaignService: CampaignService,
    private fb: FormBuilder) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user && this.user.role === Role.ADMIN) {
        this.isAdmin = true;
      }
    });
  }


  // COMMENTARE PER INTERO IL METODO PER EVITARE DI RESETTARE I PERSONAGGI
  public resetStatusAllCharacter() {
    // let allcharacters = []
    // this.characterService.getCharacters().then((characters) => {
    //   allcharacters = characters;
    //   // allcharacters.push(characters[0]);
    //   allcharacters.forEach(character => {
    //     // character.campaign = {
    //     //   id: character.campaignId,
    //     //   status: 'active'
    //     // }
    //     // if (character.id === 'TghUf9a989N9iMWKTGb0tsAv0L12-17') {
    //       // character.equipaggiamento.map((item) => {
    //       //   item.createdBy = character.id;
    //       //   item.previousOwner = null;
    //       //   return item;
    //       // })
    //       // this.characterService.updateInventory(character.id, character.equipaggiamento).then(() => {
    //         this.characterService.adminCharUpdate(character.id, [], character.campaignId);
    //       // });
    //     // }
    //   });
    // });
  }

  // COMMENTARE PER INTERO IL METODO PER EVITARE DI RESETTARE LE CAMPAGNE
  public resetStatusCampaigns() {
    // this.campaignService.updateAllCampaigns();
    // let allCampaigns = []
    // this.campaignService.getAllCampaigns().then((campaigns) => {
    //   campaigns.forEach(campaign => {
    //     campaign.inventory.forEach((item) => {
    //       item.visible = false;
    //       item.quantity = 0;
    //       item.id = Math.random().toString(36).substring(2);
    //     });
    //     this.campaignService.updateInventory(campaign.id, campaign.inventory);
    //   });
    // });
  }

  public resetSpellCharacters() {
    this.characterService.updateCharacterSpell();
  }

  public updateUserCampaigns() {
    this.firebaseService.getThenUpdateAllUsers();
  }
}
