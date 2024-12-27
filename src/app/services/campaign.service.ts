import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FormGroup } from '@angular/forms';
import { AdventurerUser } from '../models/adventurerUser';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  public campaigns: WritableSignal<any[]> = signal([]);
  public user: AdventurerUser | null = null;

  constructor(private firebaseService: FirebaseService) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
    });
    // const ownerId = getAuth().currentUser!.uid;
    // this.getSignalCampaigns(ownerId);
  }

  public async addCampaign(infoCampaign: any): Promise<any> {
    const newCampaignId = this.user.id + '-C-' + (this.user.campaignProgressive + 1);
    const docRef = doc(this.firebaseService.database, 'campaigns', newCampaignId);
    return await setDoc(docRef, {
      title: infoCampaign.title,
      password: infoCampaign.password,
      ownerId: this.user.id,
      dmName: infoCampaign.dmName,
      partecipants: [],
      characters: [],
      chapterUrl: infoCampaign.chapterUrl || '',
      description: infoCampaign.description || '',
      createdAt: new Date(),
      lastUpdate: new Date(),
      story: [],
      quests: [],
      rules: [],
      entries: [],
      achievements: [],
      allies: [],
      organizations: [],
      addons: [],
      inventory: [],
      commonInventory: [],
      archive: [],
      encounter: {
        list: [],
        started: false,
        activeIndex: 0
      },
      nextSession: '',
      status: {
        statusCode: 0,
        statusMessage: 'Nuova'
      }
    }).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.user.id);
      setDoc(userRef, {
        createdCampaigns: arrayUnion(newCampaignId),
        campaignProgressive: this.user.campaignProgressive + 1
      }, { merge: true });
      const logRef = doc(this.firebaseService.database, 'logs', newCampaignId);
      setDoc(logRef, {
        logs: [],
        campId: newCampaignId
      });
    });
  }

  public getAllCampaigns(): Promise<any> {
    const ref = collection(this.firebaseService.database, 'campaigns');
    return getDocs(ref).then((doc) => {
      const result: any[] = [];
      doc.forEach(doc => {
        const campaign = {
          id: doc.id,
          ...doc.data()
        }
        result.push(campaign);
      });
      return result;
    })
  }

  public async deleteCampaignById(id: string): Promise<any> {
    const ref = doc(this.firebaseService.database, 'campaigns', id);
    return await deleteDoc(ref).then(() => {
      const userRef = doc(this.firebaseService.database, 'users', this.user.id);
      setDoc(userRef, {
        createdCampaigns: arrayRemove(id)
      }, { merge: true });
    });
  }

  public async getUserCampaigns(): Promise<any> {
    // this.user = this.firebaseService.userSignal();
    const asOwner = await this.getCampaignsByOwnerID(this.user.id);
    const asPartecipant = await this.getCampaignsByPartecipantID(this.user.id);
    return {
      asOwner: asOwner,
      asPartecipant: asPartecipant
    }
  }

  public async getCampaignsByOwnerID(ownerId: string): Promise<any[]> {
    const ref = collection(this.firebaseService.database, 'campaigns');
    const q = query(ref, where('ownerId', '==', ownerId));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const campaign = {
        id: doc.id,
        ...doc.data()
      }
      result.push(campaign);
    });

    return result;
  }

  public async getCampaignsByPartecipantID(partecipantId: string): Promise<any[]> {
    const ref = collection(this.firebaseService.database, 'campaigns');
    const q = query(ref, where('partecipants', 'array-contains', partecipantId));
    const docs = await getDocs(q);
    const result: any[] = [];
    docs.forEach(doc => {
      const campaign = {
        id: doc.id,
        ...doc.data()
      }
      result.push(campaign);
    });

    return result;
  }

  public async getCampaignById(id: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {...docSnap.data(), id: docSnap.id};
    }
  }

  // public getSignalCampaigns(campId: string): void {
  //   const ref = collection(this.firebaseService.database, 'campaigns');
  //   const q = query(ref, where('ownerId', '==', campId));
  //   const unsub = onSnapshot(q, (snapshot) => {
  //     const result: any[] = [];
  //     snapshot.forEach(doc => {
  //       const campaign = {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //       result.push(campaign);
  //     });
  //     this.campaigns.set(result);
  //     console.log('Campaigns', result);
      
  //   });
  // }

  public getSignalSingleCampaing(campId: string): void {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    const unsub = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const campaign = {
          id: doc.id,
          ...doc.data()
        }
        this.campaigns.set([campaign]);
      }
    });
  }


  // public getSignalCharacters(ids: string[]): void {
  //   const docRef = collection(this.firebaseService.database, 'characters');
  //   const unsub = onSnapshot(docRef, (snapshot) => {
  //     const result: any[] = [];
  //     snapshot.forEach(doc => {
  //       const character = {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //       if (ids.includes(character.id)) {
  //         result.push(character);
  //       }
  //     });
  //     this.campaignCharacters.set(result);
  //   });
  // }

  public async checkCampaign(id: string, password: string): Promise<boolean> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()['ownerId'] === this.user.id) {
      return false;
    }
    if (docSnap.exists()) {
      const campaign = docSnap.data();
      return campaign['password'] === password;
    }
    return false;
  }

  public async subscribeToCampaign(campId: string, userId: string, heroId: string): Promise<any> {
    const heroRef = doc(this.firebaseService.database, 'characters', heroId);
    const heroSnap = await getDoc(heroRef).then(async char => {
      await setDoc(heroRef, {
        campaignId: campId
      }, { merge: true });

      const docRef = doc(this.firebaseService.database, 'campaigns', campId);
      return await setDoc(docRef, {
        characters: arrayUnion({id: char.id, url: char.data()['informazioniBase'].urlImmaginePersonaggio, userId: char.data()['status'].userId}),
        partecipants: arrayUnion(userId),
        lastUpdate: new Date(),
        status: {
          statusCode: 1,
          statusMessage: 'In preparazione'
        }
      }, { merge: true }).then(() => {
        const userRef = doc(this.firebaseService.database, 'users', userId);
        setDoc(userRef, {
          campaignsAsPartecipant: arrayUnion(campId)
        }, { merge: true });
      });;
    });
  }

  public async editTitleDescription(campId: string, form: any): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      title: form.title,
      description: form.description,
      chapterUrl: form.chapterUrl,
      adventure: form.adventure,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async startCampaign(campId: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      status: {
        statusCode: 2,
        statusMessage: 'In corso'
      },
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addStory(campId: string, story: any): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      story: arrayUnion(story),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignStory(campId: string, stories: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      story: stories,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addQuest(campId: string, quest: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      quests: arrayUnion(quest),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignQuest(campId: string, quests: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      quests: quests,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addRule(campId: string, rule: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      rules: arrayUnion(rule),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignRule(campId: string, rules: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      rules: rules,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addEntry(campId: string, entry: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      entries: arrayUnion(entry),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignEntries(campId: string, entries: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      entries: entries,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addAchievement(campId: string, achievement: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      achievements: arrayUnion(achievement),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCampaignAchievement(campId: string, achievements: any[]): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      achievements: achievements,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addAlly(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      allies: arrayUnion(form),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateAllies(id: string, allies: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      allies: allies,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addOrganization(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      organizations: arrayUnion(form),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateOrganizations(id: string, organizations: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      organizations: organizations,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addAddon(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      addons: arrayUnion(form),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateAddons(id: string, addons: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      addons: addons,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addItemInventory(id: string, form: FormGroup): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      inventory: arrayUnion(form),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateInventory(id: string, inventory: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      inventory: inventory,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async addCommonItem(id: string, item: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      commonInventory: arrayUnion(item),
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateCommonInventory(id: string, deposit: any[]): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      commonInventory: deposit,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async newEncounter(campId: string, encounter: any): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      encounter: encounter,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async updateNextSession(id: string, nextSession: Date): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', id);
    return await setDoc(docRef, {
      nextSession: nextSession,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async setDDDiceRoomSlug(campId: string, slug: string): Promise<void> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
    return await setDoc(docRef, {
      dddiceSlug: slug,
      lastUpdate: new Date()
    }, { merge: true });
  }

  public async newChapter(campId: string, campaignData: any, newTitle: string, newDescription: string): Promise<any> {
    const docRef = doc(this.firebaseService.database, 'campaigns', campId);
  
    const archive = {
      title: campaignData.title,
      description: campaignData.description,
      story: campaignData.story,
      quests: campaignData.quests.filter((quest: any) => !quest.longQuest), 
      npcs: campaignData.npcs,
      rules: campaignData.rules,
      achievements: campaignData.achievements,
    };
  
    return await setDoc(docRef, {
      title: newTitle,
      description: newDescription,
      archive: arrayUnion(archive),
      story: [],
      quests: campaignData.quests.filter((quest: any) => quest.longQuest),
      npcs: [],
      rules: [],
      achievements: [],
      lastUpdate: new Date()
    }, { merge: true });
  }

  public removeChar(campId: string, char: any): Promise<any> {
    // 1. Rimuove dal Character il CampaignId
    const charRef = doc(this.firebaseService.database, 'characters', char.id);
    return setDoc(charRef, {
      campaignId: ''
    }, { merge: true }).then(() => {
      // 2. Rimuove dallo User il CampaignId nell'array campaignAsPartecipant
      const userRef = doc(this.firebaseService.database, 'users', char.userId);
      return setDoc(userRef, {
        campaignsAsPartecipant: arrayRemove(campId)
      }, { merge: true }).then(() => {
        // 3. Rimuove il Character dall'array characters della Campagna
        const campRef = doc(this.firebaseService.database, 'campaigns', campId);
        return setDoc(campRef, {
          characters: arrayRemove(char),
          partecipants: arrayRemove(char.userId),
        }, { merge: true });
      });
    });
  }

  public async setCampaignAsFavorite(campId: string): Promise<void> {
    const userRef = doc(this.firebaseService.database, 'users', this.user.id);
    return await setDoc(userRef, {
      favoriteCampaign: campId
    }, { merge: true });
  }
}
