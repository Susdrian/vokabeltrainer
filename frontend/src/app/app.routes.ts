import {Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {HomeComponent} from "./home/home.component";
import {EditdeckComponent} from "./editdeck/editdeck.component";
import {NewdeckComponent} from "./newdeck/newdeck.component";
import {TestModeComponent} from "./test-mode/test-mode.component";
import {LearnModeComponent} from "./learn-mode/learn-mode.component";
import {NutzungsbedingungenComponent} from "./nutzungsbedingungen/nutzungsbedingungen.component";

export const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: "full"},
  {path: 'main', component: MainPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'home', component: HomeComponent
  },
  {path:'editdeck/:id', component:EditdeckComponent},
  {path:'newdeck', component:NewdeckComponent},
  {path:'test/:id',component:TestModeComponent},
  {path:'learn/:id',component:LearnModeComponent},
  {path:'bedingungen', component:NutzungsbedingungenComponent},
  { path: '**', redirectTo: 'home'}
];
