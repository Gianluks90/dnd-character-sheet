import { Injectable } from '@angular/core';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { Item } from 'src/app/models/item';
import { CampaignService } from 'src/app/services/campaign.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterViewNextService {

  constructor(
    private campService: CampaignService
  ) { }

  public verifyEditMode(user: AdventurerUser, char: any): boolean | any {
    if (user) {
      if (user.id === char.status.userId) {
        return true;
      }
      if (char.campaign.id !== '') {
        this.campService.getCampaignById(char.campaign.id).then((c) => {
          if (c.ownerId === user.id) {
            return true;
          } else {
            return false;
          }
        })
      }
    }
  }

  public calcCA(char: any) {
    let CA = 10 + Math.floor((char.caratteristiche.destrezza -10) /2);
    let CAShield = '';
    const equip = char.equipaggiamento as any[];
    equip.forEach((i: Item) => {
      if (i.weared) {
        if (i.CA > 0 && !i.shield) {
          if (i.plusDexterity) {
            CA = (i.CA + Math.floor((char.caratteristiche.destrezza - 10) / 2));
          } else {
            CA = i.CA;
          }
        }
        if (i.CA > 0 && i.shield) {
          CAShield = '+ ' + i.CA;
        }
      }
    });

    return {
      CA,
      CAShield
    }
  }

  public calcBonuses(char: any) {
    const character: any = char;
    const bonuses = char.privilegiTratti.reduce((acc: any[], privilegioTratto: any) => acc.concat(privilegioTratto.bonuses), []).filter((bonus: any) => bonus !== undefined) as any[];

    bonuses.forEach((b: any) => {
      if (b.element === 'punti ferita') {
        character.parametriVitali.massimoPuntiFerita = b.value; 
        if (character.parametriVitali.puntiFeritaAttuali > character.parametriVitali.massimoPuntiFerita) {
          character.parametriVitali.puntiFeritaAttuali = character.parametriVitali.massimoPuntiFerita;
        }
      }
      if (b.element === 'velocità') {
        character.velocita = b.value;
      }
      if (b.element === 'iniziativa') {
        character.iniziativa = b.value;
      }
      character.caratteristiche[b.element] ? character.caratteristiche[b.element] += b.value : null;
    });
    return character;
  }
}
