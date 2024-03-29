import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CommentComponent } from './comment.component';
import { CommentDetailComponent } from './comment-detail.component';
import { CommentPopupComponent } from './comment-dialog.component';
import { CommentDeletePopupComponent } from './comment-delete-dialog.component';

export const commentRoute: Routes = [
    {
        path: 'comment',
        component: CommentComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'skeletonApp.comment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'comment/:id',
        component: CommentDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'skeletonApp.comment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const commentPopupRoute: Routes = [
    {
        path: 'comment-new',
        component: CommentPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'skeletonApp.comment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'comment/:id/edit',
        component: CommentPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'skeletonApp.comment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'comment/:id/delete',
        component: CommentDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'skeletonApp.comment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
