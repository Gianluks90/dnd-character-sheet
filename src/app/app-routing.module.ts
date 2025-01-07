import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./components/auth/auth.component";
import { CharacterListComponent } from "./components/character-list/character-list.component";
import { CharacterViewComponent } from "./components/character-view/character-view.component";
import { FormCreateComponent } from "./components/form-create/form-create.component";
import { FormLevelUpComponent } from "./components/form-level-up/form-level-up.component";
import { AuthGuardService } from "./services/auth-guard.service";
import { CampaignListComponent } from "./components/campaign-list/campaign-list.component";
import { CampaignViewComponent } from "./components/campaign-view/campaign-view.component";
import { HomePageComponent } from "./components/home-page/home-page.component";
import { ResourcesPageComponent } from "./components/resources-page/resources-page.component";
import { AdventuresPageComponent } from "./components/adventures-page/adventures-page.component";
import { AdventureEditorComponent } from "./components/adventure-editor/adventure-editor.component";
import { CharacterViewNextComponent } from "./components/character-view-next/character-view-next.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: AuthComponent },
  { path: 'create/:id', component: FormCreateComponent, canActivate: [AuthGuardService] },
  { path: 'levelup/:id', component: FormLevelUpComponent, canActivate: [AuthGuardService]},
  { path: 'view/:id', component: CharacterViewComponent, canActivate: [AuthGuardService] },
  { path: 'view-next/:id', component: CharacterViewNextComponent, canActivate: [AuthGuardService] },
  { path: 'characters', component: CharacterListComponent, canActivate: [AuthGuardService] },
  { path: 'campaigns', component: CampaignListComponent, canActivate: [AuthGuardService] },
  { path: 'campaign-view/:id', component: CampaignViewComponent, canActivate: [AuthGuardService] },
  { path: 'resources', component: ResourcesPageComponent, canActivate: [AuthGuardService] },
  { path: 'adventures', component: AdventuresPageComponent, canActivate: [AuthGuardService] },
  { path: 'adventures/:id', component: AdventureEditorComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
