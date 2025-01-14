import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-description-tooltip',
    templateUrl: './description-tooltip.component.html',
    styleUrl: './description-tooltip.component.scss',
    standalone: false
})
export class DescriptionTooltipComponent {

  constructor() { }

  public infoData: any;
  @Input() set info(info: string) {
    this.infoData = this.infos[info];
    console.log('info', info);
    
  }

  private infos: any = {
    // Char List
    newChar: {
      title: 'Crea Personaggio',
      description: ''
    },
    openSidemenu: {
      title: 'Menu',
      description: ''
    },
    dice: {
      title: 'Dadi',
      description: ''
    },

    // Char View / Status Component
    competenzaTS: {
      title: 'Competenza Tiro Salvezza',
      description: 'Il Personaggio è competente in questo tiro salvezza (viene sommato il bonus competenza).'
    },

    // HealthBar Component
    puntiFerita: {
      title: 'Punti Ferita',
      description: 'I punti ferita rappresentano la salute del personaggio. Quando i punti ferita raggiungono lo 0 il personaggio è morente.'
    },
    puntiFeritaTemp: {
      title: 'Punti Ferita Temporanei',
      description: 'I punti ferita temporanei sono punti ferita aggiuntivi che vengono persi prima dei punti ferita normali e non possono essere ricaricati.'
    },

    // Tab Char View
    abilita: {
      title: 'Abilità e Competenze',
      description: ''
    },
    privilegiTratti: {
      title: 'Privilegi, tratti e talenti',
      description: ''
    },
    inventario: {
      title: 'Inventario',
      description: ''
    },
    descrizioneBackground: {
      title: 'Descrizione e Background',
      description: ''
    },
    gregari: {
      title: 'Gregari, Evocazioni e altro',
      description: ''
    },
    trucchettiIncantesimi: {
      title: 'Trucchetti e Incantesimi',
      description: ''
    },
    attacchi: {
      title: 'Attacchi',
      description: ''
    },
    impostazioni: {
      title: 'Impostazioni',
      description: ''
    },

    // Char View / Tab Abilità e Competenze
    competenzaAbilita: {
      title: 'Competenza Abilità',
      description: 'Il Personaggio è competente in questa abilità (viene sommato il bonus competenza al modificatore di caratteristica).'
    },
    maestriaAbilita: {
      title: 'Maestria Abilità',
      description: 'Il Personaggio è maestro in questa abilità (viene sommato, raddoppiato, il bonus di competenza al modificatore di caratteristica).'
    },

    // Char View / Tab Inventario
    denaro: {
      title: 'Gestione Denaro',
      description: 'Clicca qui per gestire il denaro in entrata, uscita ed eventuali conversioni in tagli differenti.'
    },

    // Char View / Tab Impostazioni
    vaiCampagna: {
      title: 'Vai alla Campagna',
      description: ''
    },

    // Campaign View 
    storia: {
      title: 'Storia',
      description: ''
    },
    missioni: {
      title: 'Missioni',
      description: ''
    },
    pngOrganizzazioni: {
      title: 'PNG e Organizzazioni',
      description: ''
    },
    inventarioCampagna: {
      title: 'Inventario Campagna',
      description: ''
    },
    annotazioni: {
      title: 'Annotazioni',
      description: ''
    },
    trofei: {
      title: 'Trofei',
      description: ''
    },
    incontri: {
      title: 'Incontri',
      description: ''
    },
    schermoMaster: {
      title: 'Schermo del Master',
      description: ''
    },
    impostazioniCampagna: {
      title: 'Impostazioni Campagna',
      description: ''
    },

    // Campaign View / Elenco PG
    CA: {
      title: 'Classe Armatura',
      description: 'Il valore di Classe Armatura indica quanto è complicato colpire questo personaggio. L\'eventuale CA di uno scudo è indicata a parte dopo il simbolo +.'
    },
    percezionePassiva: {
      title: 'Percezione (Passiva)',
      description: 'Il valore di Percezione Passiva indica quanto questo PG è attento all\'ambiente circostante.'
    },
    intuizionePassiva: {
      title: 'Intuizione (Passiva)',
      description: 'Il valore di Intuizione Passiva indica quanto questo PG è attento alle intenzioni delle persone.'
    },
    indagarePassiva: {
      title: 'Indagare (Passiva)',
      description: 'Il valore di Indagare Passiva indica quanto questo PG è attento ai dettagli.'
    },
    apriScheda: {
      title: 'Apri Scheda',
      description: ''
    },
    ispirazione: {
      title: 'Ispirazione',
      description: 'Il Personaggio ha un punto ispirazione che può essere utile in varia situazioni (confrontati con il DM).'
    },
    
    // Resources View
    importResources: {
      title: 'Importazione',
      description: 'Importa da tutti i tuoi PG e Campagne tutti gli elementi di questa categoria. Elementi con nomi uguali a quelli già presenti saranno ignorati e non importati.'
    },
    limit: {
      title: 'Limite',
      description: 'Questo è il limite di elementi che puoi creare. Una volta esaurito lo spazio dovrai eliminare elementi precedenti per poterne creare di nuovi.'
    }
  }
}
