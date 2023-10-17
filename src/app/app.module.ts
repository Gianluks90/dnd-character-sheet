import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { FormComponent } from './components/form/form.component';
import { CharacterViewComponent } from './components/character-view/character-view.component';


import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';

import { AddCharacterDialogComponent } from './components/sidenav/add-character-dialog/add-character-dialog.component';
import { AbilitaComponent } from './components/form/sub-form/abilita/abilita.component';
import { BackgroundComponent } from './components/form/sub-form/background/background.component';
import { BasicInformationComponent } from './components/form/sub-form/basic-information/basic-information.component';
import { CaratteristicheComponent } from './components/form/sub-form/caratteristiche/caratteristiche.component';
import { EquipaggiamentoComponent } from './components/form/sub-form/equipaggiamento/equipaggiamento.component';
import { LinguaggiCompetenzeComponent } from './components/form/sub-form/linguaggi-competenze/linguaggi-competenze.component';
import { ParametriVitaliComponent } from './components/form/sub-form/parametri-vitali/parametri-vitali.component';
import { PrivilegiTrattiComponent } from './components/form/sub-form/privilegi-tratti/privilegi-tratti.component';
import { StoriaComponent } from './components/form/sub-form/storia/storia.component';
import { TiriSalvezzaComponent } from './components/form/sub-form/tiri-salvezza/tiri-salvezza.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { MatSelectModule } from '@angular/material/select';
import { TrucchettiIncantesimiComponent } from './components/form/sub-form/trucchetti-incantesimi/trucchetti-incantesimi.component';
import { MoneteComponent } from './components/monete/monete.component';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarComponent } from './components/utilities/snackbar/snackbar.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    FormComponent,
    CharacterViewComponent,
    BasicInformationComponent,
    AddCharacterDialogComponent,
    SidenavComponent,
    AbilitaComponent,
    CaratteristicheComponent,
    EquipaggiamentoComponent,
    LinguaggiCompetenzeComponent,
    ParametriVitaliComponent,
    PrivilegiTrattiComponent,
    TiriSalvezzaComponent,
    BackgroundComponent,
    StoriaComponent,
    CharacterListComponent,
    TrucchettiIncantesimiComponent,
    MoneteComponent,
    SnackbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatMenuModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
