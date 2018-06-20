/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SkeletonTestModule } from '../../../test.module';
import { PostDialogComponent } from '../../../../../../main/webapp/app/entities/post/post-dialog.component';
import { PostService } from '../../../../../../main/webapp/app/entities/post/post.service';
import { Post } from '../../../../../../main/webapp/app/entities/post/post.model';
import { FrontpageconfigService } from '../../../../../../main/webapp/app/entities/frontpageconfig';
import { BlogService } from '../../../../../../main/webapp/app/entities/blog';
import { TagService } from '../../../../../../main/webapp/app/entities/tag';
import { TopicService } from '../../../../../../main/webapp/app/entities/topic';

describe('Component Tests', () => {

    describe('Post Management Dialog Component', () => {
        let comp: PostDialogComponent;
        let fixture: ComponentFixture<PostDialogComponent>;
        let service: PostService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SkeletonTestModule],
                declarations: [PostDialogComponent],
                providers: [
                    FrontpageconfigService,
                    BlogService,
                    TagService,
                    TopicService,
                    PostService
                ]
            })
            .overrideTemplate(PostDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PostDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PostService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Post(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.post = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'postListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Post();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.post = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'postListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
