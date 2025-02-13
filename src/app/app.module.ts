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
import { SettingsDialogComponent } from "./components/sidenav/settings-dialog/settings-dialog.component";
import { AddCampaignDialogComponent } from './components/campaign-list/add-campaign-dialog/add-campaign-dialog.component';
import { DeleteCampaignDialogComponent } from './components/campaign-list/delete-campaign-dialog/delete-campaign-dialog.component';
import { AddSpellDialogComponent } from './components/character-view/sub-components/trucchetti-incantesimi-tab-view/add-spell-dialog/add-spell-dialog.component';
import { TicketCampaignDialogComponent } from './components/campaign-list/ticket-campaign-dialog/ticket-campaign-dialog.component';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { ResourcesPageComponent } from './components/resources-page/resources-page.component';
import { AddResourceItemDialogComponent } from './components/utilities/inventory/add-resource-item-dialog/add-resource-item-dialog.component';
import { AddResourceSpellDialogComponent } from './components/character-view/sub-components/trucchetti-incantesimi-tab-view/add-resource-spell-dialog/add-resource-spell-dialog.component';
import { AddAlliesResourcesDialogComponent } from './components/utilities/npcs/add-allies-resources-dialog/add-allies-resources-dialog.component';
import { AddAddonsResourcesDialogComponent } from './components/utilities/npcs/add-addons-resources-dialog/add-addons-resources-dialog.component';
import { AddOrganizationsResourcesDialogComponent } from './components/utilities/npcs/add-organizations-resources-dialog/add-organizations-resources-dialog.component';
import { ManageResourcesDialogComponent } from './components/resources-page/manage-resources-dialog/manage-resources-dialog.component';
import { SharedUtilitisModule } from "./modules/shared-utilitis/shared-utilitis.module";
import { SharedCharacterModule } from "./modules/shared-character/shared-character.module";
import { SharedCampaignModule } from "./modules/shared-campaign/shared-campaign.module";
import { SharedAdventureModule } from "./modules/shared-adventure/shared-adventure.module";
import { CharRestDialogComponent } from './components/character-view/char-rest-dialog/char-rest-dialog.component';
import { ConditionDialogComponent } from './components/utilities/conditions/condition-dialog/condition-dialog.component';
import { ConditionInfoDialogComponent } from './components/utilities/conditions/condition-info-dialog/condition-info-dialog.component';
import { ResourceTooltipComponent } from './components/utilities/resource-tooltip/resource-tooltip.component';
import { MagicDetailComponent } from './components/character-view-next/character-view-next-content/sub-components/char-next-magic/magic-detail/magic-detail.component';
import { CharNextAddonsComponent } from './components/character-view-next/character-view-next-content/sub-components/char-next-addons/char-next-addons.component';

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
        ResourceTooltipComponent,

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
