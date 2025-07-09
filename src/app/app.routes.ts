import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FacultyLoginComponent } from './faculty-login/faculty-login.component';
import { Dashboard } from './dashboard/dashboard';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { SupportComponent } from './support/support.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';

import { TestComponent } from './test/test.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'adminlogin', component: AdminLoginComponent },
    { path: 'facultylogin', component: FacultyLoginComponent },
    { path: 'dashboard', component: Dashboard },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-of-service', component: TermsOfServiceComponent },
    { path: 'support', component: SupportComponent },
    { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
    { path: 'test', component: TestComponent },
];
