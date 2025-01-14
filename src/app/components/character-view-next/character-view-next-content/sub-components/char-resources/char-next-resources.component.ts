import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConditionDialogComponent } from 'src/app/components/utilities/conditions/condition-dialog/condition-dialog.component';
import { ConditionInfoDialogComponent } from 'src/app/components/utilities/conditions/condition-info-dialog/condition-info-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-next-char-resources',
  standalone: false,
  templateUrl: './char-next-resources.component.html',
  styleUrl: './char-next-resources.component.scss'
})
export class CharNextResourcesComponent {

  constructor(
    private matDialog: MatDialog,
    private charService: CharacterService
  ) { }

  public _char: any;
  @Input() set char(character: any) {
    this._char = character;
    console.log('CharNextResourcesComponent: ', this._char);
    
    setTimeout(() => {
      this.setupResources();
    }, 100);
  }

  public _edit: boolean = false;
  @Input() set edit(editMode: boolean) {
    this._edit = editMode;
  }

  private setupResources(): void { }

    public newCondition(): void {
      this.matDialog.open(ConditionDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '500px',
        autoFocus: false,
        disableClose: true,
        backdropClass: 'as-dialog-backdrop',
        data: {
          characters: [this._char]
        }
      });
    }
  
    public conditionInfo(condition: any): void {
      this.matDialog.open(ConditionInfoDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '500px',
        autoFocus: false,
        disableClose: true,
        backdropClass: 'as-dialog-backdrop',
        data: {
          condition: condition
        }
      }).afterClosed().subscribe((result: any) => {
        if (result && result.status === 'delete') {
          const charConditions = this._char.parametriVitali.conditions;
          const index = charConditions.findIndex((c: any) => c.name === condition.name);
          if (index > -1) {
            charConditions.splice(index, 1);
            this.charService.updateCharacterConditions(this._char.id, charConditions);
          }
        }
      });
    }

}
