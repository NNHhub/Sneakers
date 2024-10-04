import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/component/main-page.component';
import { CatalogComponent } from './catalog/component/catalog.component';
import { NewItemsComponent } from './new-items/component/new-items.component';
import { ContactComponent } from './cotact/component/contact.component';
import { ProfileComponent } from './profile/component/profile.component';
import { SigninComponent } from './signin/component/signin.component';
import { SignupComponent } from './signup/component/signup.component';
import { BasketComponent } from './basket/component/basket.component';
import { profileGuard } from './profile/guard/profile.guard';
import { loginGuard } from './signin/guard/login.guard';

export const routes: Routes = [
    {
        path:'',
        component:MainPageComponent
    },
    
    {
        path:'catalog',
        component:CatalogComponent
    },

    {
        path:'new',
        component:NewItemsComponent
    },

    {
        path:'contact',
        component:ContactComponent
    },

    {
        path:'profile',
        component:ProfileComponent,
        canActivate:[profileGuard]
    },

    {
        path:'signin',
        component:SigninComponent,
        canActivate:[loginGuard]
    },

    {
        path:'signup',
        component:SignupComponent,
        canActivate:[loginGuard]
    },

    {
        path:'basket',
        component:BasketComponent,
        canActivate:[profileGuard]
    }
];
