import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/component/main-page.component';
import { CatalogComponent } from './catalog/component/catalog.component';
import { ProfileComponent } from './profile/component/profile.component';
import { SigninComponent } from './signin/component/signin.component';
import { SignupComponent } from './signup/component/signup.component';
import { BasketComponent } from './basket/component/basket.component';
import { profileGuard } from './profile/guard/profile.guard';
import { loginGuard } from './signin/guard/login.guard';
import { AdminComponent } from './admin/component/admin.component';
import { CreateComponent } from './admin/pages/create/create.component';
import { StoreComponent } from './admin/pages/store/store.component';
import { DetailsComponent } from './catalog/pages/details/details.component';
import { CarouselComponent } from './catalog/carousel/carousel.component';

export const routes: Routes = [
    {
        path:'',
        component:MainPageComponent
    },
    
    {
        path:'catalog',
        component:CatalogComponent,
    },

    {
        path:'details/:id',
        component: DetailsComponent
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
    },
    
    {
        path:'carousel',
        component:CarouselComponent
    },
];
