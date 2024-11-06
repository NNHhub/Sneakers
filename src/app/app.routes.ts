import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/component/main-page.component';
import { CatalogComponent } from './catalog/component/catalog.component';
import { ContactComponent } from './cotact/component/contact.component';
import { ProfileComponent } from './profile/component/profile.component';
import { SigninComponent } from './signin/component/signin.component';
import { SignupComponent } from './signup/component/signup.component';
import { BasketComponent } from './basket/component/basket.component';
import { profileGuard } from './profile/guard/profile.guard';
import { loginGuard } from './signin/guard/login.guard';
import { AdminComponent } from './admin/component/admin.component';
import { adminGuard } from './admin/guard/admin.guard';
import { CreateComponent } from './admin/pages/create/create.component';
import { StoreComponent } from './admin/pages/store/store.component';

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
    },

    {
        path:'admin',
        component:AdminComponent,
        
        children:[
            {
                path:'create',
                component:CreateComponent
            },

            {
                path:'store',
                component:StoreComponent
            }
        ]
    }
];
