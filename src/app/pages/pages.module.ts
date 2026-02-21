import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductListComponent } from './product/list/list.component';
import { ProductCreateComponent } from './product/create/create.component';
import { ProductEditComponent } from './product/edit/edit.component';

import { CategoryListComponent } from './category/list/list.component';
import { CategoryCreateComponent } from './category/create/create.component';
import { CategoryEditComponent } from './category/edit/edit.component';

import { OrderListComponent } from './order/list/list.component';
import { OrderCreateComponent } from './order/create/create.component';
import { OrderEditComponent } from './order/edit/edit.component';

import { UserListComponent } from './user/list/list.component';
import { UserCreateComponent } from './user/create/create.component';
import { UserEditComponent } from './user/edit/edit.component';

import { ClientListComponent } from './client/list/list.component';
import { ClientCreateComponent } from './client/create/create.component';
import { ClientEditComponent } from './client/edit/edit.component';

import { DriverListComponent } from './driver/list/list.component';
import { DriverCreateComponent } from './driver/create/create.component';

import { GalleryListComponent } from './gallery/list/list.component';
import { GalleryCreateComponent } from './gallery/create/create.component';

import { SubcategoryListComponent } from './sub-category/list/list.component';
import { SubcategoryCreateComponent } from './sub-category/create/create.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SubcategoryEditComponent } from './sub-category/edit/edit.component';
import { GalleryEditComponent } from './gallery/edit/edit.component';
import { DriverEditComponent } from './driver/edit/edit.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: []
})
export class PagesModule {}
