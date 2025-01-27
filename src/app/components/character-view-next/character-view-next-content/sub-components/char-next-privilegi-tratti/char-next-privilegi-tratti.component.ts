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
    const groupedByTag = this._char.privilegiTratti.reduce((acc, privilege, index) => {
      if (!acc[privilege.tag]) {
        acc[privilege.tag] = [];
      }
      acc[privilege.tag].push({ ...privilege, id: index });
      return acc;
    }, {});
  
    this.privilegeGroups = Object.keys(groupedByTag)
      .sort()
      .map(tag => {
        return {
          tag,
          privileges: groupedByTag[tag].sort((a, b) =>
            a.nome.localeCompare(b.nome)
          )
        };
      });
  }

  public openAddDialog(): void {
    this.matDialog.open(EditPrivilegioTrattoDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      backdropClass: 'as-dialog-backdrop',
    }).afterClosed().subscribe((result: any) => {
      if (result && result.status === 'success') {
        this.charService.addPrivilegioTratto(this._char.id, result.data);
      }
    });
  }

  public openEditDialog(privilege: any): void {
    this.matDialog.open(EditPrivilegioTrattoDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '60%',
      autoFocus: false,
      backdropClass: 'as-dialog-backdrop',
      data: {
        privilegioTratto: privilege
      }
    }).afterClosed().subscribe((result: any) => {
      if (result) {
        const group = this.privilegeGroups.find(g => g.tag === privilege.tag);
        if (!group) return;
        const privilegeIndex = group.privileges.findIndex(p => p.id === privilege.id);
        if (privilegeIndex === -1) return;

        switch (result.status) {
          case 'success':
            group.privileges[privilegeIndex] = { ...result.data, id: privilege.id };
            this._char.privilegiTratti[privilege.id] = result.data;
            this.charService.updatePrivilegiTratti(this._char.id, this._char.privilegiTratti);
            break;

          case 'delete':
            group.privileges.splice(privilegeIndex, 1);
            this._char.privilegiTratti.splice(privilege.id, 1);
            this.privilegeGroups.forEach(g => {
              g.privileges.forEach((p, idx) => (p.id = idx));
            });
            this._char.privilegiTratti.forEach((p, idx) => (p.id = idx));
            this.charService.updatePrivilegiTratti(this._char.id, this._char.privilegiTratti);
            break;
        }
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
