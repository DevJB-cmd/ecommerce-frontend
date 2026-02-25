import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
	{ path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
	{ path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
	{ path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
	{ path: 'dashboard', redirectTo: 'admin/dashboard', pathMatch: 'full' },
	{ path: 'products', loadComponent: () => import('./pages/product/list/list.component').then(m => m.ProductListComponent) },
	{ path: 'products/:id', loadComponent: () => import('./pages/details/product-detail.component').then(m => m.ProductDetailComponent) },
	{ path: 'product/edit/:id', loadComponent: () => import('./pages/product/edit/edit.component').then(m => m.ProductEditComponent) },
	{ path: 'product/create', loadComponent: () => import('./pages/product/create/create.component').then(m => m.ProductCreateComponent) },
	{ path: 'categories', loadComponent: () => import('./pages/category/list/list.component').then(m => m.CategoryListComponent) },

	{ path: 'auth/login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
	{ path: 'auth/register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },

	// admin area (guard will be applied in app.config or by route guard functions)
	{ path: 'admin', loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes) },

	{ path: '**', redirectTo: 'home' }
];
