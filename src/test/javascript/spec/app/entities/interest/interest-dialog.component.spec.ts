/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SkeletonTestModule } from '../../../test.module';
import { InterestDialogComponent } from '../../../../../../main/webapp/app/entities/interest/interest-dialog.component';
import { InterestService } from '../../../../../../main/webapp/app/entities/interest/interest.service';
import { Interest } from '../../../../../../main/webapp/app/entities/interest/interest.model';
import { PartyService } from '../../../../../../main/webapp/app/entities/party';

describe('Component Tests', () => {

    describe('Interest Management Dialog Component', () => {
        let comp: InterestDialogComponent;
        let fixture: ComponentFixture<InterestDialogComponent>;
        let service: InterestService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SkeletonTestModule],
                declarations: [InterestDialogComponent],
                providers: [
                    PartyService,
                    InterestService
                ]
            })
            .overrideTemplate(InterestDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(InterestDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(InterestService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Interest(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.interest = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'interestListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Interest();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.interest = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'interestListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
