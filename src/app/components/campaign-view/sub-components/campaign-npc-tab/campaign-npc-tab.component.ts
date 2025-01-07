import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-campaign-npc-tab',
    templateUrl: './campaign-npc-tab.component.html',
    styleUrl: './campaign-npc-tab.component.scss',
    standalone: false
})
export class CampaignNpcTabComponent {

  public campaignData: any;
  @Input() set campaign(data: any) {
    this.campaignData = data;
    
  }
  
  public isOwnerData: boolean = false;
  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  public charData: any;
  @Input() set character(data: any) {
    this.charData = data;
  }
}
