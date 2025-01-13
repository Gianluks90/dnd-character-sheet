import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { Item } from 'src/app/models/item';
import { CampaignService } from 'src/app/services/campaign.service';

interface Skill {
  param: string;
  label: string;
  proficient: boolean;
  mastered: boolean;
  modifier: number;
  description?: string;
}

const SKILL_TO_ATTRIBUTE_MAP: { [skill: string]: string } = {
  acrobazia: 'destrezza',
  addestrareAnimali: 'saggezza',
  arcano: 'intelligenza',
  atletica: 'forza',
  furtivita: 'destrezza',
  indagare: 'intelligenza',
  inganno: 'carisma',
  intimidire: 'carisma',
  intrattenere: 'carisma',
  intuizione: 'saggezza',
  medicina: 'saggezza',
  natura: 'intelligenza',
  percezione: 'saggezza',
  persuasione: 'carisma',
  rapiditaDiMano: 'destrezza',
  religione: 'intelligenza',
  sopravvivenza: 'saggezza',
  storia: 'intelligenza',
};

const LABEL_OVERRIDES: { [key: string]: string } = {
  furtività: "furtività", // Aggiunto l'accento
  addestrareAnimali: "addestrare animali", // Spazio
  rapiditaDiMano: "rapidità di mano", // Accento e spazio
};

@Injectable({
  providedIn: 'root'
})
export class CharacterViewNextService {

  constructor(
    private campService: CampaignService,
    private http: HttpClient
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

  calcSkills(char: any): Observable<Skill[]> {
    return this.http.get('./assets/settings/skillsDescriptionNext.json').pipe(
      map((descriptions: any) => {
        const result: Skill[] = [];
        const proficiencyBonus = char.tiriSalvezza.bonusCompetenza;
  
        const LABEL_OVERRIDES: { [key: string]: string } = {
          furtivita: "furtività",
          addestrareAnimali: "addestrare animali",
          rapiditaDiMano: "rapidità di mano",
        };
  
        for (const [skill, attribute] of Object.entries(SKILL_TO_ATTRIBUTE_MAP)) {
          const proficient = char.competenzaAbilita[skill] || false;
          const mastered =
            char.competenzaAbilita[`maestria${skill.charAt(0).toUpperCase() + skill.slice(1)}`] ||
            false;
  
          // Calcolo del modificatore della caratteristica
          const attributeValue = char.caratteristiche[attribute] || 10; // Default a 10
          const modifier =
            Math.floor((attributeValue - 10) / 2) +
            (proficient ? proficiencyBonus : 0) +
            (mastered ? proficiencyBonus : 0);
  
          // Applica l'override del label, se presente
          const label = LABEL_OVERRIDES[skill] || skill;
  
          result.push({
            param: attribute.charAt(0).toUpperCase() + attribute.slice(1, 3),
            label,
            proficient,
            mastered,
            modifier,
            description: descriptions[label],
          });
        }
  
        return result;
      })
    );
  }

  // calcSkills(char: any): Skill[] {
  //   const result: Skill[] = [];
  //   const proficiencyBonus = char.tiriSalvezza.bonusCompetenza;
  //   const descriptions = this.http.get('./assets/settings/skillDescription.json').subscribe((data: any) => {
  //     return data;
  //   });
    
  
  //   const LABEL_OVERRIDES: { [key: string]: string } = {
  //     furtivita: "furtività",
  //     addestrareAnimali: "addestrare animali",
  //     rapiditaDiMano: "rapidità di mano",
  //   };
  
  //   for (const [skill, attribute] of Object.entries(SKILL_TO_ATTRIBUTE_MAP)) {
  //     const proficient = char.competenzaAbilita[skill] || false;
  //     const mastered = char.competenzaAbilita[`maestria${skill.charAt(0).toUpperCase() + skill.slice(1)}`] || false;
  
  //     // Calcolo del modificatore della caratteristica
  //     const attributeValue = char.caratteristiche[attribute] || 10; // Default a 10
  //     const modifier =
  //       Math.floor((attributeValue - 10) / 2) +
  //       (proficient ? proficiencyBonus : 0) +
  //       (mastered ? proficiencyBonus : 0);
  
  //     // Applica l'override del label, se presente
  //     const label = LABEL_OVERRIDES[skill] || skill;
  
  //     result.push({
  //       param: attribute.charAt(0).toUpperCase() + attribute.slice(1, 3),
  //       label,
  //       proficient,
  //       mastered,
  //       modifier,
  //       description: descriptions[skill],
  //     });
  //   }
  
  //   console.log("result", result);
  //   return result;
  // }
}
