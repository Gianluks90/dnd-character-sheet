import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyComponent } from 'src/app/components/utilities/money/money.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoneyDialogComponent } from 'src/app/components/character-view/sub-components/equipaggiamento-tab-view/money-dialog/money-dialog.component';
import { EquipmentComponent } from 'src/app/components/utilities/equipment/equipment.component';
import { ManageEquipDialogComponent } from 'src/app/components/utilities/equipment/manage-equip-dialog/manage-equip-dialog.component';
import { HealthBarComponent } from 'src/app/components/utilities/health-bar/health-bar.component';
import { HealthPointDialogComponent } from 'src/app/components/utilities/health-bar/health-point-dialog/health-point-dialog.component';
import { AddItemDialogComponent } from 'src/app/components/utilities/inventory/add-item-dialog/add-item-dialog.component';
import { InventoryComponent } from 'src/app/components/utilities/inventory/inventory.component';
import { ItemTooltipComponent } from 'src/app/components/utilities/item-tooltip/item-tooltip.component';
import { EditMoneyControllerDialogComponent } from 'src/app/components/utilities/money-controller/edit-money-controller-dialog/edit-money-controller-dialog.component';
import { MoneyControllerComponent } from 'src/app/components/utilities/money-controller/money-controller.component';
import { AddNpcDialogComponent } from 'src/app/components/utilities/npcs/add-npc-dialog/add-npc-dialog.component';
import { AddOrganizationDialogComponent } from 'src/app/components/utilities/npcs/add-organization-dialog/add-organization-dialog.component';
import { NpcsComponent } from 'src/app/components/utilities/npcs/npcs.component';
import { SnackbarComponent } from 'src/app/components/utilities/snackbar/snackbar.component';
import { DiceRollerComponent } from 'src/app/components/utilities/dice-roller/dice-roller.component';
import { DescriptionTooltipComponent } from 'src/app/components/utilities/description-tooltip/description-tooltip.component';
import { InventoryCampaignComponent } from 'src/app/components/utilities/inventory-campaign/inventory-campaign.component';
import { DocumentDialogComponent } from 'src/app/components/utilities/inventory/item-info-sheet/document-dialog/document-dialog.component';
import { SkillContainerComponent } from 'src/app/components/utilities/skill-container/skill-container.component';
import { SkillTooltipComponent } from 'src/app/components/utilities/skill-tooltip/skill-tooltip.component';

const components = [
  MoneyComponent,
  SnackbarComponent,
  HealthPointDialogComponent,
  MoneyDialogComponent,
  InventoryComponent,
  AddItemDialogComponent,
  HealthBarComponent,
  ItemTooltipComponent,
  EquipmentComponent,
  ManageEquipDialogComponent,
  MoneyControllerComponent,
  EditMoneyControllerDialogComponent,
  NpcsComponent,
  AddNpcDialogComponent,
  AddOrganizationDialogComponent,
  DiceRollerComponent,
  DescriptionTooltipComponent,
  InventoryCampaignComponent,
  DocumentDialogComponent,
  SkillContainerComponent,
  SkillTooltipComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[...components]
})
export class SharedUtilitisModule { }
