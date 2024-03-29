/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SkeletonTestModule } from '../../../test.module';
import { PhotoComponent } from '../../../../../../main/webapp/app/entities/photo/photo.component';
import { PhotoService } from '../../../../../../main/webapp/app/entities/photo/photo.service';
import { Photo } from '../../../../../../main/webapp/app/entities/photo/photo.model';

describe('Component Tests', () => {

    describe('Photo Management Component', () => {
        let comp: PhotoComponent;
        let fixture: ComponentFixture<PhotoComponent>;
        let service: PhotoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SkeletonTestModule],
                declarations: [PhotoComponent],
                providers: [
                    PhotoService
                ]
            })
            .overrideTemplate(PhotoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PhotoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PhotoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Photo(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.photos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
