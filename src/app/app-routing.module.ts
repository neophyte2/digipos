import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./pages/layouts/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/layouts/client/client.module').then(m => m.ClientModule),
  },

  // redirect to `first-component`
  { path: '**', redirectTo: '/auth/dashboard', pathMatch: 'full' },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
