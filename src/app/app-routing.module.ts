import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './sevices/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "",
        redirectTo: "auth",
        pathMatch: "full",
      },
      {
        path: "auth",
        loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "",
        loadChildren: () => import("./pages/main.module").then((m) => m.MainModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
