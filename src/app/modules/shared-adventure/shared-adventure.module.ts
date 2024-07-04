import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddElementsDialogComponent } from 'src/app/components/adventure-editor/add-elements-dialog/add-elements-dialog.component';
import { AdventureEditorComponent } from 'src/app/components/adventure-editor/adventure-editor.component';
import { NewAdventureChapterDialogComponent } from 'src/app/components/adventure-editor/new-adventure-chapter-dialog/new-adventure-chapter-dialog.component';
import { AdventureViewComponent } from 'src/app/components/adventure-view/adventure-view.component';
import { AdventuresPageComponent } from 'src/app/components/adventures-page/adventures-page.component';
import { NewAdventureDialogComponent } from 'src/app/components/adventures-page/new-adventure-dialog/new-adventure-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';

const components = [
  AdventuresPageComponent,
  NewAdventureDialogComponent,
  AdventureEditorComponent,
  AdventureViewComponent,
  NewAdventureChapterDialogComponent,
  AddElementsDialogComponent,
];


@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  exports: [...components]
})
export class SharedAdventureModule { }
