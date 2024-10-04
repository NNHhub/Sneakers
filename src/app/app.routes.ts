import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/component/main-page.component';
import { CatalogComponent } from './catalog/component/catalog.component';
import { NewItemsComponent } from './new-items/component/new-items.component';
import { ContactComponent } from './cotact/component/contact.component';
import { ProfileComponent } from './profile/component/profile.component';
import { SigninComponent } from './signin/component/signin.component';
import { SignupComponent } from './signup/component/signup.component';
import { BasketComponent } from './basket/component/basket.component';

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
        component:ProfileComponent
    },

    {
        path:'signin',
        component:SigninComponent
    },

    {
        path:'signup',
        component:SignupComponent
    },

    {
        path:'basket',
        component:BasketComponent
    }
];
