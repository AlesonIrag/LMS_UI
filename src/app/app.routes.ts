import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FacultyLoginComponent } from './faculty-login/faculty-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { SupportComponent } from './support/support.component';

import { TestComponent } from './test/test.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'adminlogin', component: AdminLoginComponent },
    { path: 'facultylogin', component: FacultyLoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-of-service', component: TermsOfServiceComponent },
    { path: 'support', component: SupportComponent },
    { path: 'test', component: TestComponent },
];
