import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Album } from './album.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Album>;

@Injectable()
export class AlbumService {

    private resourceUrl =  SERVER_API_URL + 'api/albums';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/albums';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(album: Album): Observable<EntityResponseType> {
        const copy = this.convert(album);
        return this.http.post<Album>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(album: Album): Observable<EntityResponseType> {
        const copy = this.convert(album);
        return this.http.put<Album>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Album>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Album[]>> {
        const options = createRequestOption(req);
        return this.http.get<Album[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Album[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Album[]>> {
        const options = createRequestOption(req);
        return this.http.get<Album[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Album[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Album = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Album[]>): HttpResponse<Album[]> {
        const jsonResponse: Album[] = res.body;
        const body: Album[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Album.
     */
    private convertItemFromServer(album: Album): Album {
        const copy: Album = Object.assign({}, album);
        copy.creationDate = this.dateUtils
            .convertDateTimeFromServer(album.creationDate);
        return copy;
    }

    /**
     * Convert a Album to a JSON which can be sent to the server.
     */
    private convert(album: Album): Album {
        const copy: Album = Object.assign({}, album);

        copy.creationDate = this.dateUtils.toDate(album.creationDate);
        return copy;
    }
}
