import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditStoryDialogComponent } from 'src/app/components/character-view/sub-components/descrizione-background-tab-view/edit-story-dialog/edit-story-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-char-next-background',
  standalone: false,
  templateUrl: './char-next-background.component.html',
  styleUrl: './char-next-background.component.scss'
})
export class CharNextBackgroundComponent {
  constructor(private matDialog: MatDialog, private charService: CharacterService) {}

  public _char: any;
  @Input() set char(char: any) {
    this._char = char;
  }

  public _edit: boolean;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

    public openEditStoryDialog() {
      this.matDialog.open(EditStoryDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '60%',
        autoFocus: false,
        backdropClass: 'as-dialog-backdrop',
        data: { story: this._char.storiaPersonaggio }
      }).afterClosed().subscribe((result) => {
        if (result && result.status === 'success') {
          this.charService.updateStory(this._char.id, result.story);
        }
      });
    }
}
