import { Component, Input } from '@angular/core';

interface ResourceTooltipInfo {
  label: string;
  color: string;
  description: string;
  value: number;
  max: number;
  isTemporary: boolean;
  automaticResolve?: boolean;
  shortRest: boolean;
}

@Component({
  selector: 'app-resource-tooltip',
  standalone: false,
  
  templateUrl: './resource-tooltip.component.html',
  styleUrl: './resource-tooltip.component.scss'
})
export class ResourceTooltipComponent {
  constructor() { }
  
  public _resource: ResourceTooltipInfo;
  @Input() set resource(resource: any) {
    this._resource = resource;
  }
}
