import { NgModule, isDevMode } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from "./app.component";
import { AuthComponent } from "./components/auth/auth.component";
import { HomePageComponent } from './components/home-page/home-page.component';
import { CharacterListComponent } from "./components/character-list/character-list.component";
import { DeleteCharacterDialogComponent } from "./components/character-list/delete-character-dialog/delete-character-dialog.component";
import { CharacterViewComponent } from "./components/character-view/character-view.component";
import { CompleteCharacterDialogComponent } from "./components/form-create/complete-character-dialog/complete-character-dialog.component";
import { FormCreateComponent } from "./components/form-create/form-create.component";
import { AbilitaComponent } from "./components/form-create/sub-form/abilita/abilita.component";
import { BackgroundComponent } from "./components/form-create/sub-form/background/background.component";
import { InformazioniBaseComponent } from "./components/form-create/sub-form/basic-information/informazioni-base.component";
import { CaratteristicheComponent } from "./components/form-create/sub-form/caratteristiche/caratteristiche.component";
import { EquipaggiamentoComponent } from "./components/form-create/sub-form/equipaggiamento/equipaggiamento.component";
import { LinguaggiCompetenzeComponent } from "./components/form-create/sub-form/linguaggi-competenze/linguaggi-competenze.component";
import { ParametriVitaliComponent } from "./components/form-create/sub-form/parametri-vitali/parametri-vitali.component";
import { PrivilegiTrattiComponent } from "./components/form-create/sub-form/privilegi-tratti/privilegi-tratti.component";
import { StoriaComponent } from "./components/form-create/sub-form/storia/storia.component";
import { TiriSalvezzaComponent } from "./components/form-create/sub-form/tiri-salvezza/tiri-salvezza.component";
import { TrucchettiIncantesimiComponent } from "./components/form-create/sub-form/trucchetti-incantesimi/trucchetti-incantesimi.component";
import { FormLevelUpComponent } from "./components/form-level-up/form-level-up.component";
import { AddCharacterDialogComponent } from "./components/character-list/add-character-dialog/add-character-dialog.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { SnackbarComponent } from "./components/utilities/snackbar/snackbar.component";
import { SharedModule } from "./modules/shared/shared.module";
import { SidenavService } from "./services/sidenav.service";
import { CompleteLevelUpDialogComponent } from './components/form-level-up/complete-level-up-dialog/complete-level-up-dialog.component';
import { InformazioniBaseLevelUpComponent } from './components/form-level-up/sub-components/informazioni-base-level-up/informazioni-base-level-up.component';
import { CaratteristicheLevelUpComponent } from './components/form-level-up/sub-components/caratteristiche-level-up/caratteristiche-level-up.component';
import { TiriSalvezzaLevelUpComponent } from './components/form-level-up/sub-components/tiri-salvezza-level-up/tiri-salvezza-level-up.component';
import { CompetenzeAbilitaLevelUpComponent } from './components/form-level-up/sub-components/competenze-abilita-level-up/competenze-abilita-level-up.component';
import { ParametriVitaliLevelUpComponent } from './components/form-level-up/sub-components/parametri-vitali-level-up/parametri-vitali-level-up.component';
import { CompetenzeLinguaggiLevelUpComponent } from './components/form-level-up/sub-components/competenze-linguaggi-level-up/competenze-linguaggi-level-up.component';
import { PrivilegiTrattiLevelUpComponent } from './components/form-level-up/sub-components/privilegi-tratti-level-up/privilegi-tratti-level-up.component';
import { TrucchettiIncantesimiLevelUpComponent } from './components/form-level-up/sub-components/trucchetti-incantesimi-level-up/trucchetti-incantesimi-level-up.component';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { CharacterViewStatusComponent } from "./components/character-view/sub-components/character-view-status/character-view-status.component";
import { PrivilegiTrattiTabViewComponent } from './components/character-view/sub-components/privilegi-tratti-tab-view/privilegi-tratti-tab-view.component';
import { EquipaggiamentoTabViewComponent } from './components/character-view/sub-components/equipaggiamento-tab-view/equipaggiamento-tab-view.component';
import { MoneyDialogComponent } from './components/character-view/sub-components/equipaggiamento-tab-view/money-dialog/money-dialog.component';
import { AbilitaTabViewComponent } from './components/character-view/sub-components/abilita-tab-view/abilita-tab-view.component';
import { HealthPointDialogComponent } from './components/utilities/health-bar/health-point-dialog/health-point-dialog.component';
import { DescrizioneBackgroundTabViewComponent } from './components/character-view/sub-components/descrizione-background-tab-view/descrizione-background-tab-view.component';
import { TrucchettiIncantesimiTabViewComponent } from './components/character-view/sub-components/trucchetti-incantesimi-tab-view/trucchetti-incantesimi-tab-view.component';
import { SettingsDialogComponent } from "./components/sidenav/settings-dialog/settings-dialog.component";
import { InventoryComponent } from "./components/utilities/inventory/inventory.component";
import { AddItemDialogComponent } from "./components/utilities/inventory/add-item-dialog/add-item-dialog.component";
import { SettingsTabViewComponent } from './components/character-view/sub-components/settings-tab-view/settings-tab-view.component';
import { HealthBarComponent } from './components/utilities/health-bar/health-bar.component';
// import { MoneyComponent } from "./components/utilities/money/money.component";
import { ItemInfoSheetComponent } from './components/utilities/inventory/item-info-sheet/item-info-sheet.component';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { AddCampaignDialogComponent } from './components/campaign-list/add-campaign-dialog/add-campaign-dialog.component';
import { DeleteCampaignDialogComponent } from './components/campaign-list/delete-campaign-dialog/delete-campaign-dialog.component';
import { AddSpellDialogComponent } from './components/character-view/sub-components/trucchetti-incantesimi-tab-view/add-spell-dialog/add-spell-dialog.component';
import { CampaignViewComponent } from './components/campaign-view/campaign-view.component';
import { TicketCampaignDialogComponent } from './components/campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { AttacchiTabViewComponent } from './components/character-view/sub-components/attacchi-tab-view/attacchi-tab-view.component';
import { AddAttackDialogComponent } from './components/character-view/sub-components/attacchi-tab-view/add-attack-dialog/add-attack-dialog.component';
import { CampaignCharListComponent } from './components/campaign-view/sub-components/campaign-char-list/campaign-char-list.component';
import { CampaignStoryTabComponent } from './components/campaign-view/sub-components/campaign-story-tab/campaign-story-tab.component';
import { AddStoryDialogComponent } from './components/campaign-view/sub-components/campaign-story-tab/add-story-dialog/add-story-dialog.component';
import { CampaignSettingsTabComponent } from './components/campaign-view/sub-components/campaign-settings-tab/campaign-settings-tab.component';
import { CampaignQuestsTabComponent } from './components/campaign-view/sub-components/campaign-quests-tab/campaign-quests-tab.component';
import { AddQuestDialogComponent } from './components/campaign-view/sub-components/campaign-quests-tab/add-quest-dialog/add-quest-dialog.component';
import { CharacterBottomSheetComponent } from "./components/campaign-view/sub-components/character-bottom-sheet/character-bottom-sheet.component";
import { CampaignEntriesTabComponent } from './components/campaign-view/sub-components/campaign-entries-tab/campaign-entries-tab.component';
import { AddEntryDialogComponent } from './components/campaign-view/sub-components/campaign-entries-tab/add-entry-dialog/add-entry-dialog.component';
import { CampaignAchievementsTabComponent } from './components/campaign-view/sub-components/campaign-achievements-tab/campaign-achievements-tab.component';
import { AddAchievementDialogComponent } from './components/campaign-view/sub-components/campaign-achievements-tab/add-achievement-dialog/add-achievement-dialog.component';
import { NewChapterDialogComponent } from './components/campaign-view/sub-components/campaign-settings-tab/new-chapter-dialog/new-chapter-dialog.component';
import { ArchiveStoryDialogComponent } from './components/campaign-view/sub-components/campaign-story-tab/archive-story-dialog/archive-story-dialog.component';
import { ArchiveQuestDialogComponent } from './components/campaign-view/sub-components/campaign-quests-tab/archive-quest-dialog/archive-quest-dialog.component';
import { ArchiveAchievementDialogComponent } from './components/campaign-view/sub-components/campaign-achievements-tab/archive-achievement-dialog/archive-achievement-dialog.component';
import { CompanionTabViewComponent } from './components/character-view/sub-components/companion-tab-view/companion-tab-view.component';
import { CampaignNpcTabComponent } from './components/campaign-view/sub-components/campaign-npc-tab/campaign-npc-tab.component';
import { MasterScreenTabComponent } from './components/campaign-view/sub-components/master-screen-tab/master-screen-tab.component';
import { RemoveCharDialogComponent } from './components/campaign-view/sub-components/campaign-settings-tab/remove-char-dialog/remove-char-dialog.component';
import { CampaignInventoryTabComponent } from './components/campaign-view/sub-components/campaign-inventory-tab/campaign-inventory-tab.component';
import { NextSessionDialogComponent } from './components/campaign-view/next-session-dialog/next-session-dialog.component';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { EditStoryDialogComponent } from './components/character-view/sub-components/descrizione-background-tab-view/edit-story-dialog/edit-story-dialog.component';
import { EditPrivilegioTrattoDialogComponent } from './components/character-view/sub-components/privilegi-tratti-tab-view/edit-privilegio-tratto-dialog/edit-privilegio-tratto-dialog.component';
import { CampaignCharTabComponent } from './components/campaign-view/sub-components/campaign-char-tab/campaign-char-tab.component';
import { RemoveCampaignDialogComponent } from './components/campaign-view/sub-components/campaign-settings-tab/remove-campaign-dialog/remove-campaign-dialog.component';
import { AddResourceDialogComponent } from './components/character-view/sub-components/character-view-status/add-resource-dialog/add-resource-dialog.component';
import { DescriptionTooltipComponent } from './components/utilities/description-tooltip/description-tooltip.component';
import { InventoryCampaignComponent } from './components/utilities/inventory-campaign/inventory-campaign.component';
import { ExchangeDialogComponent } from './components/utilities/inventory-campaign/exchange-dialog/exchange-dialog.component';
import { ResourcesPageComponent } from './components/resources-page/resources-page.component';
import { AddResourceItemDialogComponent } from './components/utilities/inventory/add-resource-item-dialog/add-resource-item-dialog.component';
import { AddResourceSpellDialogComponent } from './components/character-view/sub-components/trucchetti-incantesimi-tab-view/add-resource-spell-dialog/add-resource-spell-dialog.component';
import { AddAlliesResourcesDialogComponent } from './components/utilities/npcs/add-allies-resources-dialog/add-allies-resources-dialog.component';
import { AddAddonsResourcesDialogComponent } from './components/utilities/npcs/add-addons-resources-dialog/add-addons-resources-dialog.component';
import { AddOrganizationsResourcesDialogComponent } from './components/utilities/npcs/add-organizations-resources-dialog/add-organizations-resources-dialog.component';
import { ManageResourcesDialogComponent } from './components/resources-page/manage-resources-dialog/manage-resources-dialog.component';
import { DocumentDialogComponent } from './components/utilities/inventory/item-info-sheet/document-dialog/document-dialog.component';
import { CampaignEncounterTabComponent } from './components/campaign-view/sub-components/campaign-encounter-tab/campaign-encounter-tab.component';
import { NewEncounterDialogComponent } from './components/campaign-view/sub-components/campaign-encounter-tab/new-encounter-dialog/new-encounter-dialog.component';
import { AdventuresPageComponent } from './components/adventures-page/adventures-page.component';
import { NewAdventureDialogComponent } from './components/adventures-page/new-adventure-dialog/new-adventure-dialog.component';
import { AdventureEditorComponent } from './components/adventure-editor/adventure-editor.component';
import { AdventureViewComponent } from './components/adventure-view/adventure-view.component';
import { NewAdventureChapterDialogComponent } from "./components/adventure-editor/new-adventure-chapter-dialog/new-adventure-chapter-dialog.component";
import { AddElementsDialogComponent } from './components/adventure-editor/add-elements-dialog/add-elements-dialog.component';
import { DiceRollerComponent } from './components/utilities/dice-roller/dice-roller.component';
import { SharedUtilitisModule } from "./modules/shared-utilitis/shared-utilitis.module";
import { SharedCharacterModule } from "./modules/shared-character/shared-character.module";
import { SharedCampaignModule } from "./modules/shared-campaign/shared-campaign.module";
import { SharedAdventureModule } from "./modules/shared-adventure/shared-adventure.module";
import { CharRestDialogComponent } from './components/character-view/char-rest-dialog/char-rest-dialog.component';
import { ConditionDialogComponent } from './components/utilities/conditions/condition-dialog/condition-dialog.component';
import { ConditionInfoDialogComponent } from './components/utilities/conditions/condition-info-dialog/condition-info-dialog.component';
import { SharedPipesModule } from "./modules/shared-pipes/shared-pipes.module";
import { CharacterViewNextComponent } from './components/character-view-next/character-view-next.component';
import { SkillContainerComponent } from './components/utilities/skill-container/skill-container.component';
import { CharacterViewNextContentComponent } from './components/character-view-next/character-view-next-content/character-view-next-content.component';

@NgModule({
    declarations: [
        // PIPES
        // BonusStringPipe,
        // ComposeClassStringPipe,
        // ComposeCharInfoStringPipe,
        // CapitalizeStringPipe,

        // MAIN COMPONENTS
        AppComponent,
        AuthComponent,
        HomePageComponent,

        // VIEWS COMPONENTS
        SidenavComponent,
        SettingsDialogComponent,

        // DIALOG COMPONENTS
        DeleteCharacterDialogComponent,
        CompleteCharacterDialogComponent,
        AddCharacterDialogComponent,
        CharacterListComponent,
        CompleteLevelUpDialogComponent,
        AddCampaignDialogComponent,
        DeleteCampaignDialogComponent,
        AddSpellDialogComponent,
        TicketCampaignDialogComponent,

        // UTILITIES COMPONENTS
        // MoneyComponent,
        // SnackbarComponent,
        // HealthPointDialogComponent,
        // MoneyDialogComponent,
        // InventoryComponent,
        // AddItemDialogComponent,
        // HealthBarComponent,
        // ItemTooltipComponent,
        // EquipmentComponent,
        // ManageEquipDialogComponent,
        // MoneyControllerComponent,
        // EditMoneyControllerDialogComponent,
        // NpcsComponent,
        // AddNpcDialogComponent,
        // AddOrganizationDialogComponent,
        // DiceRollerComponent,
        // DescriptionTooltipComponent,
        // InventoryCampaignComponent,
        // DocumentDialogComponent,

        // FORM CREATE COMPONENTS AND SUB-COMPONENTS
        FormCreateComponent,
        // sub-components
        InformazioniBaseComponent,
        AbilitaComponent,
        CaratteristicheComponent,
        EquipaggiamentoComponent,
        LinguaggiCompetenzeComponent,
        ParametriVitaliComponent,
        PrivilegiTrattiComponent,
        TiriSalvezzaComponent,
        BackgroundComponent,
        StoriaComponent,
        TrucchettiIncantesimiComponent,

        // FORM LEVEL UP COMPONENTS AND SUB-COMPONENTS
        FormLevelUpComponent,
        // sub-components
        InformazioniBaseLevelUpComponent,
        CaratteristicheLevelUpComponent,
        TiriSalvezzaLevelUpComponent,
        CompetenzeAbilitaLevelUpComponent,
        ParametriVitaliLevelUpComponent,
        CompetenzeLinguaggiLevelUpComponent,
        PrivilegiTrattiLevelUpComponent,
        TrucchettiIncantesimiLevelUpComponent,

        // CHARACTER VIEW COMPONENT AND SUB-COMPONENTS
        // CharacterViewComponent,
        // sub-components
        // CharacterViewStatusComponent,
        // PrivilegiTrattiTabViewComponent,
        // EquipaggiamentoTabViewComponent,
        // AbilitaTabViewComponent,
        // DescrizioneBackgroundTabViewComponent,
        // TrucchettiIncantesimiTabViewComponent,
        // SettingsTabViewComponent,
        // ItemInfoSheetComponent,
        // AttacchiTabViewComponent,
        // EditPrivilegioTrattoDialogComponent,
        // AddAttackDialogComponent,
        // CompanionTabViewComponent,

        // CAMPAIGN COMPONENTS AND SUB-COMPONENTS
        // CampaignListComponent,
        // CampaignViewComponent,
        // sub-components
        // CampaignCharListComponent,
        // CampaignStoryTabComponent,
        // AddStoryDialogComponent,
        // CampaignSettingsTabComponent,
        // CharacterBottomSheetComponent,
        // CampaignQuestsTabComponent,
        // AddQuestDialogComponent,
        // CampaignEntriesTabComponent,
        // AddEntryDialogComponent,
        // CampaignAchievementsTabComponent,
        // AddAchievementDialogComponent,
        // NewChapterDialogComponent,
        // ArchiveStoryDialogComponent,
        // ArchiveQuestDialogComponent,
        // ArchiveAchievementDialogComponent,
        // CampaignNpcTabComponent,
        // MasterScreenTabComponent,
        // RemoveCharDialogComponent,
        // CampaignInventoryTabComponent,
        // NextSessionDialogComponent,
        // EditStoryDialogComponent,
        // CampaignEncounterTabComponent,
        // NewEncounterDialogComponent,
        // CampaignCharTabComponent,
        // RemoveCampaignDialogComponent,
        // AddResourceDialogComponent,
        // ExchangeDialogComponent,

        //resource component
        ResourcesPageComponent,
        AddResourceItemDialogComponent,
        AddResourceSpellDialogComponent,
        AddAlliesResourcesDialogComponent,
        AddAddonsResourcesDialogComponent,
        AddOrganizationsResourcesDialogComponent,
        ManageResourcesDialogComponent,
        CharRestDialogComponent,
        ConditionDialogComponent,
        ConditionInfoDialogComponent,

        // adventure component
        // AdventuresPageComponent,
        // NewAdventureDialogComponent,
        // AdventureEditorComponent,
        // AdventureViewComponent,
        // NewAdventureChapterDialogComponent,
        // AddElementsDialogComponent,

    ],
    bootstrap: [AppComponent],
    imports: [
        SharedModule,
        SharedUtilitisModule,
        SharedCharacterModule,
        SharedAdventureModule,
        SharedCampaignModule,
        // SharedPipesModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [SidenavService, { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }, provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
