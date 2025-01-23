import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { FormGroup } from '@angular/forms';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Item } from '../models/item';
import { Spell } from '../models/spell';
import { AdventurerUser } from '../models/adventurerUser';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  public user: AdventurerUser | null;

  constructor(private firebaseService: FirebaseService) { 
    // this.getSignalCharacters();
    effect(() => {
      this.user = this.firebaseService.userSignal();
    });
  }

  public campaignCharacters: WritableSignal<any[]> = signal([]);
  public character: WritableSignal<any> = signal(null);

  public async getCharacterById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  public getCharacterSignalById(id: string): void {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    const unsub = onSnapshot(docRef, (snapshot) => {
      this.character.set({
        id: snapshot.id,
        ...snapshot.data()
      });
    });
  }

  public async getCharacters(): Promise<any[]> {
    const docRef = collection(this.firebaseService.database, 'characters');
    const docs = await getDocs(docRef);
    const result: any[] = [];
    docs.forEach(doc => {
      const character = {
        id: doc.id,
        ...doc.data()
      }
      result.push(character);
    });

    return result;
  }

  public getSignalCharacters(campaignId?: string): void {
    const docRef = collection(this.firebaseService.database, 'characters');
    if (campaignId) {
      const filteredQuery = query(docRef, where('campaign.id', '==', campaignId));
      const unsub = onSnapshot(filteredQuery, (snapshot) => {
        const result: any[] = [];
        snapshot.forEach(doc => {
          const character = {
            id: doc.id,
            ...doc.data()
          }
          result.push(character);
        });
        this.campaignCharacters.set(result);
      });
    } else {
      const unsub = onSnapshot(docRef, (snapshot) => {
        const result: any[] = [];
        snapshot.forEach(doc => {
          const character = {
            id: doc.id,
            ...doc.data()
          }
          result.push(character);
        });
        this.campaignCharacters.set(result);
      });
    }
  }
  
  // public getSignalCampaigns(): void {
  //   const docRef = collection(this.firebaseService.database, 'campaigns');
  //   const unsub = onSnapshot(docRef, (snapshot) => {
  //     const result: any[] = [];
  //     snapshot.forEach(doc => {
  //       const campaign = {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //       result.push(campaign);
  //     });
  //     this.campaigns.set(result);
  //   });
  // }

  public async getCharactersByUserId(id: string): Promise<any[]> {
    const docRef = collection(this.firebaseService.database, 'characters');
    const q = query(docRef, where('status.userId', '==', id));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const character = {
        id: doc.id,
        ...doc.data()
      }
      result.push(character);
    });

    return result;
  }

  public async createCharacter(form: FormGroup): Promise<any> {
    const newCharacterId = this.user.id + '-' + (this.user.progressive + 1);
    const docRef = doc(this.firebaseService.database, 'characters', newCharacterId);
    return await setDoc(docRef, {
      ...form.value,
      campaignId: '',
      campaign: {
        id: '',
        status: 'inactive'
      },
      id: newCharacterId,
      status: {
        creationDate: new Date(),
        lastUpdateDate: new Date(),
        userId: this.user.id,
        author: this.user.displayName,
        statusCode: 0,
        sheetColor: '#FFFFFF40'
      }
    }).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.user.id);
      setDoc(userRef, {
        characters: arrayUnion(newCharacterId),
        progressive: this.user.progressive + 1
      }, { merge: true });
    });
  }

  public async deleteCharacterById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await deleteDoc(docRef).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.user.id);
      setDoc(userRef, {
        characters: arrayRemove(id)
      }, { merge: true });
    });
  }

  public async updateCharacterById(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, form.value, { merge: true });
  }

  public async updateCharacterSheetColorById(id: string, sheetColor: string, sheetTitleColor: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      status: {
        sheetColor: sheetColor,
        sheetTitleColor: sheetTitleColor
      }
    }, { merge: true });
  }

  public async updateMoney(id: string, money: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      denaro: {
        ...money
      }
    }, { merge: true });
  }

  public async updateCharacterPFById(id: string, form: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        puntiFeritaAttuali: form.pf,
        puntiFeritaTemporaneiAttuali: form.pft,
        massimoPuntiFeritaTemporanei: form.pftMax
      }
    }, { merge: true });
  }

  public async updateCharacterDadiVitaById(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        dadiVita: form.value.dadiVita
      }
    }, { merge: true });
  }

  public async updateCharacterConditions(id: string, conditions: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        conditions: conditions
      }
    }, { merge: true });
  }

  // Cambiare i parametri da aggiornare su tutti i PG a piacere prima di lanciare il comando.
  public async adminCharUpdate(char: any): Promise<any> {
    const ref = doc(this.firebaseService.database, 'characters', char.id);
    return await setDoc(ref, {
      informazioniBase: {
        risorseAggiuntive: char.informazioniBase.risorseAggiuntive
      }
      // sets: [],
      // equipaggiamento: equip,
      // parametriVitali: {
      //   conditions: []
      // }
      // campaign: {
      //   id: campId,
      //   status: 'active'
      // }
      // status: {
      //   usePrideRule: true
      // }
    }, { merge: true })
  }

  public async addPrivilegioTratto(id: string, p: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      privilegiTratti: arrayUnion(p)
    }, { merge: true });
  }

  public async updatePrivilegiTratti(id: string, privilegiTratti: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      privilegiTratti: privilegiTratti
    }, { merge: true });
  }

  public async addItemInventory(id: string, form: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      equipaggiamento: arrayUnion(form)
    }, { merge: true });
  }

  public async updateInventory(id: string, inventory: Item[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      equipaggiamento: inventory
    }, { merge: true });
  }

  public async updateSets(id: string, sets: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      sets: sets
    }, { merge: true });
  }

  public async addSpell(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      magia: {
        trucchettiIncantesimi: arrayUnion(form)
      }
    }, { merge: true });
  }

  public async updateSpells(id: string, spells: Spell[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      magia: {
        trucchettiIncantesimi: spells
      }
    }, { merge: true });
  }

  public async addAttack(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      attacchi: arrayUnion(form)
    }, { merge: true });
  }

  public async updateAttacks(id: string, attacks: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      attacchi: attacks
    }, { merge: true });
  }

  public async addResource(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      informazioniBase: {
        risorseAggiuntive: arrayUnion(form)
      }
    }, { merge: true });
  }

  public async updateAdditionalResources(id: string, resources: any[]) {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      informazioniBase: {
        risorseAggiuntive: resources
      }
    }, { merge: true });
  }

  public async updateDadiVita(id: string, dadi: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      parametriVitali: {
        dadiVita: dadi
      }
    }, { merge: true });
  }

  public async updateInspiration(id: string, value: boolean): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    setDoc(docRef, {
      ispirazione: value
    }, { merge: true });
  }

  public async updateSlotIncantesimi(id: string, slots: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      magia: {
        slotIncantesimi: slots
      }
    }, { merge: true });
  }

  public async updatePrideRule(id: string, rule: boolean): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      status: {
        usePrideRule: rule
      }
    }, { merge: true });
  }

  public async updatePrideFlag(id: string, flag: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      status: {
        prideFlag: flag
      }
    }, { merge: true });
  }

  public async updateWeightRule(id: string, rule: boolean): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      status: {
        useWeightRule: rule
      }
    }, { merge: true });
  }

  public async updateOpacityInventoryRule(id: string, rule: boolean): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      status: {
        useOpacityInventoryRule: rule
      }
    }, { merge: true });
  }

  // public async updateAttacks(id: string, attacks: any[]): Promise<any> {
  //   const docRef = doc(this.firebaseService.database, 'characters', id);
  //   return await setDoc(docRef, {
  //     attacchi: attacks
  //   }, { merge: true });
  // }

  // ALLIES AND ORGANIZATIONS

  public async addAlly(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      allies: arrayUnion(form)
    }, { merge: true });
  }

  public async updateAllies(id: string, allies: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      allies: allies
    }, { merge: true });
  }

  public async addAddon(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      addons: arrayUnion(form)
    }, { merge: true });
  }

  public async updateAddons(id: string, addons: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      addons: addons
    }, { merge: true });
  }

  public async addOrganization(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      organizations: arrayUnion(form)
    }, { merge: true });
  }

  public async updateOrganizations(id: string, organizations: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      organizations: organizations
    }, { merge: true });
  }

  public async updateStory(id: string, story: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    return await setDoc(docRef, {
      storiaPersonaggio: story
    }, { merge: true });
  }

  // ROOM DDDICE

  public async setRoom(slug: string) {
    const docRef = doc(this.firebaseService.database, 'users', getAuth().currentUser.uid);
    return await setDoc(docRef, {
      dddice_RoomSlug: slug
    }, { merge: true })
  }

  public async getRoom(): Promise<string> {
    const docRef = doc(this.firebaseService.database, 'users', getAuth().currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()['dddice_RoomSlug'];
    } else {
      return '';
    }
  }

  public async destroyRoom() {
    const docRef = doc(this.firebaseService.database, 'users', getAuth().currentUser.uid);
    return await setDoc(docRef, {
      dddice_RoomSlug: ''
    }, { merge: true })
  }

  public async updateCharacterSpell(): Promise<any> {
    this.getCharacters().then((characters) => {
      characters.forEach((character) => {
        if (character.magia) {
          character.magia.trucchettiIncantesimi.forEach((spell: any) => {
            spell.preparato = false;
            spell.filtered = false;
            spell.icon = '';
          });

          characters.forEach((character) => {
            const docRef = doc(this.firebaseService.database, 'characters', character.id);
            setDoc(docRef, character, { merge: true });
          });
        }
      });
    });
  }

  public async longRest(id: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', id);
    const dadiVita = this.character().parametriVitali.dadiVita.map((dado: any) => {
      dado.used.fill(false);
      return dado;
    });
    const parametriVitali = {
      puntiFeritaAttuali: this.character().parametriVitali.massimoPuntiFerita,
      puntiFeritaTemporaneiAttuali: 0,
      massimoPuntiFeritaTemporanei: 0,
      dadiVita: dadiVita,
      conditions: []
    };
    const risorseAggiuntive = this.character().informazioniBase.risorseAggiuntive.map((resource: any) => {
      if (resource.name !== 'Ispirazione') {
        resource.used = (resource.used as Array<any>).fill(false);
      }
      return resource;
    });
    const magia = this.character().magia ? {
      ...this.character().magia,
      slotIncantesimi: this.character().magia.slotIncantesimi.map((slot: any) => {
        slot.used.fill(false);
        return slot;
      }),
    } : {};

    return await setDoc(docRef, {
      parametriVitali: parametriVitali,
      informazioniBase: {
        risorseAggiuntive: risorseAggiuntive
      },
      magia: magia
    }, { merge: true });
  }

  public async shortRest(): Promise<void> {

  }

  public async getRollTheme(): Promise<string> {
    const userId = getAuth().currentUser.uid;
    const docRef = doc(this.firebaseService.database, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data()['rollTheme']) {
      return docSnap.data()['rollTheme'];
    } else {
      return 'dungeonscompanion2023-enemy-lp882vo8';
    }
  }

  public async setRollTheme(theme: string): Promise<any> {
    const userId = getAuth().currentUser.uid;
    const docRef = doc(this.firebaseService.database, 'users', userId);
    return await setDoc(docRef, {
      rollTheme: theme
    }, { merge: true });
  }

  public async setFavoriteCharacter(id: string): Promise<any> {
    const userId = getAuth().currentUser.uid;
    const docRef = doc(this.firebaseService.database, 'users', userId);
    return await setDoc(docRef, {
      favoriteCharacter: id
    }, { merge: true });
  }

  public async checkFavoriteCharacter(id: string): Promise<boolean> {
    const userId = getAuth().currentUser.uid;
    const docRef = doc(this.firebaseService.database, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data()['favoriteCharacter'] === id) {
      return true;
    } else {
      return false;
    }
  }

  public async disableCharCampaign(charId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', charId);
    return await setDoc(docRef, {
      campaign: {
        status: 'inactive'
      }
    }, { merge: true });
  }

  public async enableCharCampaign(charId: string, campId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', charId);
    return await setDoc(docRef, {
      campaign: {
        id: campId,
        status: 'active'
      }
    }, { merge: true });
  }

  public async removeCharCampaign(charId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'characters', charId);
    return await setDoc(docRef, {
      campaign: {
        id: '',
        status: 'inactive'
      }
    }, { merge: true });
  }

}
