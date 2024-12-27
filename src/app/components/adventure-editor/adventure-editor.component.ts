import { Platform } from '@angular/cdk/platform';
import { Component, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdventurerUser } from 'src/app/models/adventurerUser';
import { AdventureService } from 'src/app/services/adventure.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Adventure } from './models/adventure';
import { NewAdventureChapterDialogComponent } from './new-adventure-chapter-dialog/new-adventure-chapter-dialog.component';
import { AddElementsDialogComponent } from './add-elements-dialog/add-elements-dialog.component';
import { ResourcesService } from '../resources-page/resources.service';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrl: './adventure-editor.component.scss'
})
export class AdventureEditorComponent {
  public user: AdventurerUser | null;
  public adventureData: Adventure | null = null;
  public resourcesData: any | null = null;
 
  constructor(
    public firebaseService: FirebaseService,
    public sidenavService: SidenavService,
    private adventureService: AdventureService,
    private resService: ResourcesService,
    private dialog: MatDialog) {
    effect(() => {
      this.user = this.firebaseService.userSignal();
      if (this.user) {
        const adventureId = window.location.href.split('/').pop();
        this.adventureService.getSignalAdventure(adventureId);
        this.resService.getResourcesByUserId(this.user.id).then((res) => {
          this.resourcesData = res;
        });
      }
    });

    effect(() => {
      this.adventureData = this.adventureService.adventure() ? Adventure.parseData(this.adventureService.adventure()) : null;
      if (this.adventureData.id !== '') {
        this.createSubtitle();
      }
    });
  }

  public subtitle: string = '';
  public createSubtitle(): void {
    const result: string[] = [];
    result.push('Editor campagna');
    result.push(this.adventureData.chapters.length + ' ' + (this.adventureData.chapters.length === 1 ? 'avventura' : 'avventure'));
    result.push('aggiornata il ' + new Date(this.adventureData.status.lastUpdate.seconds * 1000).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
    this.subtitle = result.join(', ');
  }

  public newChapter(): void {
    this.dialog.open(NewAdventureChapterDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'success') {
        this.adventureService.addChapter(this.adventureData.id, result.chapter);
      }
    });
  }

  public editChapter(index: number): void {
    this.dialog.open(NewAdventureChapterDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      data: this.adventureData.chapters[index]
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'edited') {
        this.adventureData.chapters[index].title = result.chapter.title;
        this.adventureData.chapters[index].subtitle = result.chapter.subtitle;
        this.adventureData.chapters[index].description = result.chapter.description;
        this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
      }
    });
  }

  public chapterBookmarkToggle(index: number): void {
    this.adventureData.chapters.map((chapter, i) => {
      if (i === index) {
        chapter.bookmarked = !chapter.bookmarked;
      } else {
        chapter.bookmarked = false;
      }
      return chapter;
    });
    this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
  }

  public addElement(index: number): void {
    this.dialog.open(AddElementsDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { element: null, resources: this.resourcesData }
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'success') {
        this.adventureData.chapters[index].elements.push(result.element);
        this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
      }
    });
  }

  public editElement(chapterIndex: number, index: number): void {
    this.dialog.open(AddElementsDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { element: this.adventureData.chapters[chapterIndex].elements[index], resources: this.resourcesData }
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'edited') {
        this.adventureData.chapters[chapterIndex].elements[index] = result.element;
        this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
      }
    });
  }

  public deleteElement(chapterIndex: number, index: number): void {
    this.adventureData.chapters[chapterIndex].elements.splice(index, 1);
    this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
  }

  public addElementBelow(chapterIndex: number, index: number): void {
    this.dialog.open(AddElementsDialogComponent, {
      width: window.innerWidth < 768 ? '90%' : '50%',
      autoFocus: false,
      disableClose: true,
      data: { element: null, resources: this.resourcesData }
    }).afterClosed().subscribe((result) => {
      if (result && result.status === 'success') {
        this.adventureData.chapters[chapterIndex].elements.splice(index + 1, 0, result.element);
        this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
      }
    });
  }

  public moveElement(chapterIndex: number, index: number, direction: 'up' | 'down'): void {
    const element = this.adventureData.chapters[chapterIndex].elements[index];
    this.adventureData.chapters[chapterIndex].elements.splice(index, 1);
    this.adventureData.chapters[chapterIndex].elements.splice(direction === 'up' ? index - 1 : index + 1, 0, element);
    this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
  }

  public elementBookmarkToggle(chapterIndex: number, index: number): void {
    this.adventureData.chapters[chapterIndex].elements.map((element, i) => {
      if (i === index) {
        element.bookmarked = !element.bookmarked;
      } else {
        element.bookmarked = false;
      }
      return element;
    });
    this.adventureService.updateChapters(this.adventureData.id, this.adventureData.chapters);
  }
}
