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
    const bonuses = char.privilegiTratti.reduce((acc: any[], privilegioTratto: any) => acc.concat(privilegioTratto.bonuses), []).filter((bonus: any) => bonus !== undefined) as any[];
    let parametriVitali: any = {
      massimoPuntiFerita: 0,
    }
    let velocita: number = 0;

    bonuses.forEach((b: any) => {
      if (b.element === 'punti ferita') {
        parametriVitali.massimoPuntiFerita = b.value; 
        if (parametriVitali.puntiFeritaAttuali > parametriVitali.massimoPuntiFerita) {
          parametriVitali.puntiFeritaAttuali = parametriVitali.massimoPuntiFerita;
        }
      }
      if (b.element === 'velocità') {
        velocita = b.value;
      }
    });
    
    return {
      parametriVitali,
      velocita
    }
  
  }
}
