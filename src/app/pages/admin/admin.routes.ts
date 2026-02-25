import { Routes } from '@angular/router';
import { adminGuard } from '../../core/admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivateChild: [adminGuard as any],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent) },

      { path: 'users', loadComponent: () => import('../user/list/list.component').then(m => m.UserListComponent) },
      { path: 'users/create', loadComponent: () => import('../user/create/create.component').then(m => m.UserCreateComponent) },
      { path: 'users/edit/:id', loadComponent: () => import('../user/edit/edit.component').then(m => m.UserEditComponent) },
      { path: 'users/details/:id', loadComponent: () => import('../details/user-detail.component').then(m => m.UserDetailComponent) },

      { path: 'categories', loadComponent: () => import('../category/list/list.component').then(m => m.CategoryListComponent) },
      { path: 'categories/create', loadComponent: () => import('../category/create/create.component').then(m => m.CategoryCreateComponent) },
      { path: 'categories/edit/:id', loadComponent: () => import('../category/edit/edit.component').then(m => m.CategoryEditComponent) },

      { path: 'products', loadComponent: () => import('../product/list/list.component').then(m => m.ProductListComponent) },
      { path: 'products/create', loadComponent: () => import('../product/create/create.component').then(m => m.ProductCreateComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('../product/edit/edit.component').then(m => m.ProductEditComponent) },
      { path: 'products/details/:id', loadComponent: () => import('../details/product-detail.component').then(m => m.ProductDetailComponent) },

      { path: 'providers', loadComponent: () => import('../provider/list/list.component').then(m => m.ProviderListComponent) },
      { path: 'providers/create', loadComponent: () => import('../provider/create/create.component').then(m => m.ProviderCreateComponent) },
      { path: 'providers/edit/:id', loadComponent: () => import('../provider/edit/edit.component').then(m => m.ProviderEditComponent) },
      { path: 'providers/details/:id', loadComponent: () => import('../details/provider-detail.component').then(m => m.ProviderDetailComponent) },

      { path: 'subcategories', loadComponent: () => import('../sub-category/list/list.component').then(m => m.SubcategoryListComponent) },
      { path: 'subcategories/create', loadComponent: () => import('../sub-category/create/create.component').then(m => m.SubcategoryCreateComponent) },
      { path: 'subcategories/edit/:id', loadComponent: () => import('../sub-category/edit/edit.component').then(m => m.SubcategoryEditComponent) },

      { path: 'orders', loadComponent: () => import('../order/list/list.component').then(m => m.OrderListComponent) },
      { path: 'orders/create', loadComponent: () => import('../order/create/create.component').then(m => m.OrderCreateComponent) },
      { path: 'orders/edit/:id', loadComponent: () => import('../order/edit/edit.component').then(m => m.OrderEditComponent) },
      { path: 'orders/details/:id', loadComponent: () => import('../details/order-detail.component').then(m => m.OrderDetailComponent) },

      { path: 'clients', loadComponent: () => import('../client/list/list.component').then(m => m.ClientListComponent) },
      { path: 'clients/create', loadComponent: () => import('../client/create/create.component').then(m => m.ClientCreateComponent) },
      { path: 'clients/edit/:id', loadComponent: () => import('../client/edit/edit.component').then(m => m.ClientEditComponent) },

      { path: 'drivers', loadComponent: () => import('../driver/list/list.component').then(m => m.DriverListComponent) },
      { path: 'drivers/create', loadComponent: () => import('../driver/create/create.component').then(m => m.DriverCreateComponent) },
      { path: 'drivers/edit/:id', loadComponent: () => import('../driver/edit/edit.component').then(m => m.DriverEditComponent) },
      { path: 'drivers/details/:id', loadComponent: () => import('../details/driver-detail.component').then(m => m.DriverDetailComponent) }
    ]
  }
];
