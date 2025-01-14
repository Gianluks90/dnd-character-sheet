import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-next-char-resources',
  standalone: false,
  templateUrl: './char-next-resources.component.html',
  styleUrl: './char-next-resources.component.scss'
})
export class CharNextResourcesComponent {

  public _char: any;
  @Input() set char(character: any) {
    this._char = character;
    setTimeout(() => {
      this.setupResources();
    }, 100);
  }

  public _edit: boolean = false;
  @Input() set edit(editMode: boolean) {
    this._edit = editMode;
  }

  private setupResources(): void { }

}
