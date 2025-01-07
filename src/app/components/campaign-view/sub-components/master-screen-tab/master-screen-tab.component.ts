import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-master-screen-tab',
    templateUrl: './master-screen-tab.component.html',
    styleUrl: './master-screen-tab.component.scss',
    standalone: false
})
export class MasterScreenTabComponent {

  public screenContent: any;
  public campaignData: any;
  public isOwnerData: boolean = false;

  @Input() set campaign(data: any) {
    this.campaignData = data;
  }

  @Input() set isOwner(isOwner: boolean) {
    this.isOwnerData = isOwner;
  }

  constructor(private http: HttpClient) {
    this.http.get('./assets/settings/screenMaster.json').subscribe(data => {
      this.parseJson(data);
    });
  }

  private parseJson(data: any) {
    data.forEach((group: any) => {
      if (group.orderedList) {
        group.list.forEach(item => {
          item.description = this.splitDescriptionIntoSentences(item.description);
        });
      }
    });
    this.screenContent = data;
  }

  private splitDescriptionIntoSentences(description) {
    return description.split(". ");
  }

  public collapseAll() {
    const details = document.querySelectorAll('details');
    details.forEach((detail: any) => {
      detail.open = false;
    });
  }
}
