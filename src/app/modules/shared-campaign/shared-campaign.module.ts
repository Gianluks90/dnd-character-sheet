import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignListComponent } from 'src/app/components/campaign-list/campaign-list.component';
import { CampaignViewComponent } from 'src/app/components/campaign-view/campaign-view.component';
import { NextSessionDialogComponent } from 'src/app/components/campaign-view/next-session-dialog/next-session-dialog.component';
import { AddAchievementDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-achievements-tab/add-achievement-dialog/add-achievement-dialog.component';
import { ArchiveAchievementDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-achievements-tab/archive-achievement-dialog/archive-achievement-dialog.component';
import { CampaignAchievementsTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-achievements-tab/campaign-achievements-tab.component';
import { CampaignCharListComponent } from 'src/app/components/campaign-view/sub-components/campaign-char-list/campaign-char-list.component';
import { CampaignCharTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-char-tab/campaign-char-tab.component';
import { CampaignEncounterTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-encounter-tab/campaign-encounter-tab.component';
import { NewEncounterDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-encounter-tab/new-encounter-dialog/new-encounter-dialog.component';
import { AddEntryDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-entries-tab/add-entry-dialog/add-entry-dialog.component';
import { CampaignEntriesTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-entries-tab/campaign-entries-tab.component';
import { CampaignInventoryTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-inventory-tab/campaign-inventory-tab.component';
import { CampaignNpcTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-npc-tab/campaign-npc-tab.component';
import { AddQuestDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-quests-tab/add-quest-dialog/add-quest-dialog.component';
import { ArchiveQuestDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-quests-tab/archive-quest-dialog/archive-quest-dialog.component';
import { CampaignQuestsTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-quests-tab/campaign-quests-tab.component';
import { CampaignSettingsTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-settings-tab/campaign-settings-tab.component';
import { NewChapterDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-settings-tab/new-chapter-dialog/new-chapter-dialog.component';
import { RemoveCampaignDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-settings-tab/remove-campaign-dialog/remove-campaign-dialog.component';
import { RemoveCharDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-settings-tab/remove-char-dialog/remove-char-dialog.component';
import { AddStoryDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-story-tab/add-story-dialog/add-story-dialog.component';
import { ArchiveStoryDialogComponent } from 'src/app/components/campaign-view/sub-components/campaign-story-tab/archive-story-dialog/archive-story-dialog.component';
import { CampaignStoryTabComponent } from 'src/app/components/campaign-view/sub-components/campaign-story-tab/campaign-story-tab.component';
import { CharacterBottomSheetComponent } from 'src/app/components/campaign-view/sub-components/character-bottom-sheet/character-bottom-sheet.component';
import { MasterScreenTabComponent } from 'src/app/components/campaign-view/sub-components/master-screen-tab/master-screen-tab.component';
import { AddResourceDialogComponent } from 'src/app/components/character-view/sub-components/character-view-status/add-resource-dialog/add-resource-dialog.component';
import { EditStoryDialogComponent } from 'src/app/components/character-view/sub-components/descrizione-background-tab-view/edit-story-dialog/edit-story-dialog.component';
import { ExchangeDialogComponent } from 'src/app/components/utilities/inventory-campaign/exchange-dialog/exchange-dialog.component';
import { SharedCharacterModule } from '../shared-character/shared-character.module';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUtilitisModule } from '../shared-utilitis/shared-utilitis.module';
import { SharedAdventureModule } from '../shared-adventure/shared-adventure.module';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';



const components = [
  CampaignListComponent,
  CampaignViewComponent,
];
const subComponents = [
  CampaignCharListComponent,
  CampaignStoryTabComponent,
  AddStoryDialogComponent,
  CampaignSettingsTabComponent,
  CharacterBottomSheetComponent,
  CampaignQuestsTabComponent,
  AddQuestDialogComponent,
  CampaignEntriesTabComponent,
  AddEntryDialogComponent,
  CampaignAchievementsTabComponent,
  AddAchievementDialogComponent,
  NewChapterDialogComponent,
  ArchiveStoryDialogComponent,
  ArchiveQuestDialogComponent,
  ArchiveAchievementDialogComponent,
  CampaignNpcTabComponent,
  MasterScreenTabComponent,
  RemoveCharDialogComponent,
  CampaignInventoryTabComponent,
  NextSessionDialogComponent,
  EditStoryDialogComponent,
  CampaignEncounterTabComponent,
  NewEncounterDialogComponent,
  CampaignCharTabComponent,
  RemoveCampaignDialogComponent,
  AddResourceDialogComponent,
  ExchangeDialogComponent,
];

@NgModule({
  declarations: [
    ...components,
    ...subComponents
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedUtilitisModule,
    SharedCharacterModule,
    SharedAdventureModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedPipesModule
  ],
  exports:[
    ...components,
    ...subComponents
  ]
})
export class SharedCampaignModule { }
