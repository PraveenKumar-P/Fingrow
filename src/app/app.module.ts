import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { BnNgIdleService } from 'bn-ng-idle';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ContentAnimateDirective } from './shared/directives/content-animate.directive';
import { AuthComponent } from './auth/auth.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DirectiveModule } from './directive/directive.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonHelper } from './helper/common.helper';

declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    SpinnerComponent,
    ContentAnimateDirective,
    AuthComponent,
    LayoutComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    DirectiveModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NgxTypeaheadModule,
    ModalModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    BackButtonDisableModule.forRoot()
  ],
  providers: [
    ThemeService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    BnNgIdleService,
    CommonHelper
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
}