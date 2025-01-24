import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditPrivilegioTrattoDialogComponent } from 'src/app/components/character-view/sub-components/privilegi-tratti-tab-view/edit-privilegio-tratto-dialog/edit-privilegio-tratto-dialog.component';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-char-next-privilegi-tratti',
  standalone: false,

  templateUrl: './char-next-privilegi-tratti.component.html',
  styleUrl: './char-next-privilegi-tratti.component.scss'
})
export class CharNextPrivilegiTrattiComponent {
  constructor(private matDialog: MatDialog, private charService: CharacterService
  ) { }

  public _char: any;
  @Input() set char(char: any) {
    this._char = char;
    if (!this._char) return;
    this.initPrivileges();
  }

  public _edit: boolean;
  @Input() set edit(edit: boolean) {
    this._edit = edit;
  }

  public privilegeGroups: any[] = [];
  private initPrivileges() {
    const groupedByTag = this._char.privilegiTratti.reduce((acc, privilege) => {
      if (!acc[privilege.tag]) {
        acc[privilege.tag] = [];
      }
      acc[privilege.tag].push(privilege);
      return acc;
    }, {});
    this.privilegeGroups = Object.keys(groupedByTag).map(tag => {
      return {
        tag,
        privileges: groupedByTag[tag]
      };
    });
  }

    public openAddDialog(): void {
      this.matDialog.open(EditPrivilegioTrattoDialogComponent, {
        width: window.innerWidth < 768 ? '90%' : '50%',
        autoFocus: false,
        backdropClass: 'as-dialog-backdrop'
      }).afterClosed().subscribe((result: any) => {
        if (result && result.status === 'success') {
          this.charService.addPrivilegioTratto(this._char.id, result.data);
        }
      });
    }

  public collapseAll() {
    const details: NodeListOf<HTMLDetailsElement> = document.querySelectorAll('details');
    details.forEach((detail: HTMLDetailsElement) => {
      if (detail.id !== 'details-t') return;
      detail.open = false;
    });
  }
}
