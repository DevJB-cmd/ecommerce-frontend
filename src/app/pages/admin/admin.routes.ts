import { Routes } from '@angular/router';
import { adminGuard } from '../../core/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivateChild: [adminGuard as any],
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('../user/list/list.component').then(m => m.UserListComponent) },
      { path: 'users/create', loadComponent: () => import('../user/create/create.component').then(m => m.UserCreateComponent) },
      { path: 'users/edit/:id', loadComponent: () => import('../user/edit/edit.component').then(m => m.UserEditComponent) },

      { path: 'categories', loadComponent: () => import('../category/list/list.component').then(m => m.CategoryListComponent) },
      { path: 'categories/create', loadComponent: () => import('../category/create/create.component').then(m => m.CategoryCreateComponent) },
      { path: 'categories/edit/:id', loadComponent: () => import('../category/edit/edit.component').then(m => m.CategoryEditComponent) },

      { path: 'products', loadComponent: () => import('../product/list/list.component').then(m => m.ProductListComponent) },
      { path: 'products/create', loadComponent: () => import('../product/create/create.component').then(m => m.ProductCreateComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('../product/edit/edit.component').then(m => m.ProductEditComponent) },

      // more admin routes can be added here
    ]
  }
];
