import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CharacterViewComponent } from 'src/app/components/character-view/character-view.component';
import { AbilitaTabViewComponent } from 'src/app/components/character-view/sub-components/abilita-tab-view/abilita-tab-view.component';
import { AddAttackDialogComponent } from 'src/app/components/character-view/sub-components/attacchi-tab-view/add-attack-dialog/add-attack-dialog.component';
import { AttacchiTabViewComponent } from 'src/app/components/character-view/sub-components/attacchi-tab-view/attacchi-tab-view.component';
import { CharacterViewStatusComponent } from 'src/app/components/character-view/sub-components/character-view-status/character-view-status.component';
import { DescrizioneBackgroundTabViewComponent } from 'src/app/components/character-view/sub-components/descrizione-background-tab-view/descrizione-background-tab-view.component';
import { EquipaggiamentoTabViewComponent } from 'src/app/components/character-view/sub-components/equipaggiamento-tab-view/equipaggiamento-tab-view.component';
import { EditPrivilegioTrattoDialogComponent } from 'src/app/components/character-view/sub-components/privilegi-tratti-tab-view/edit-privilegio-tratto-dialog/edit-privilegio-tratto-dialog.component';
import { PrivilegiTrattiTabViewComponent } from 'src/app/components/character-view/sub-components/privilegi-tratti-tab-view/privilegi-tratti-tab-view.component';
import { SettingsTabViewComponent } from 'src/app/components/character-view/sub-components/settings-tab-view/settings-tab-view.component';
import { TrucchettiIncantesimiTabViewComponent } from 'src/app/components/character-view/sub-components/trucchetti-incantesimi-tab-view/trucchetti-incantesimi-tab-view.component';
import { ItemInfoSheetComponent } from 'src/app/components/utilities/inventory/item-info-sheet/item-info-sheet.component';
import { BonusStringPipe } from 'src/app/pipes/bonus-string.pipe';
import { ComposeCharInfoStringPipe } from 'src/app/pipes/compose-char-info-string.pipe';
import { ComposeClassStringPipe } from 'src/app/pipes/compose-class-string.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUtilitisModule } from '../shared-utilitis/shared-utilitis.module';
import { CompanionTabViewComponent } from 'src/app/components/character-view/sub-components/companion-tab-view/companion-tab-view.component';
import { CapitalizeStringPipe } from 'src/app/pipes/capitalize-string.pipe';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { CharacterViewNextComponent } from 'src/app/components/character-view-next/character-view-next.component';
import { CharacterViewNextContentComponent } from 'src/app/components/character-view-next/character-view-next-content/character-view-next-content.component';
import { CharNextSkillComponent } from 'src/app/components/character-view-next/character-view-next-content/sub-components/char-next-skill/char-next-skill.component';


const components = [
  CharacterViewComponent, 
  CharacterViewNextComponent, 
  CharacterViewNextContentComponent,
  CharNextSkillComponent
]

const subcomponents = [
  CharacterViewStatusComponent,
  PrivilegiTrattiTabViewComponent,
  EquipaggiamentoTabViewComponent,
  AbilitaTabViewComponent,
  DescrizioneBackgroundTabViewComponent,
  TrucchettiIncantesimiTabViewComponent,
  SettingsTabViewComponent,
  ItemInfoSheetComponent,
  AttacchiTabViewComponent,
  EditPrivilegioTrattoDialogComponent,
  AddAttackDialogComponent,
  CompanionTabViewComponent,
]


@NgModule({
  declarations: [
    ...components,
    ...subcomponents,
    // BonusStringPipe,
    // ComposeClassStringPipe,
    // ComposeCharInfoStringPipe,
    // CapitalizeStringPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedUtilitisModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipesModule
  ],
  exports:[
    ...components,
    ...subcomponents
  ]
})
export class SharedCharacterModule { }
