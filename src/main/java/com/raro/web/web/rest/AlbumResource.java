package com.raro.web.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.raro.web.domain.Album;

import com.raro.web.repository.AlbumRepository;
import com.raro.web.repository.search.AlbumSearchRepository;
import com.raro.web.web.rest.errors.BadRequestAlertException;
import com.raro.web.web.rest.util.HeaderUtil;
import com.raro.web.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Album.
 */
@RestController
@RequestMapping("/api")
public class AlbumResource {

    private final Logger log = LoggerFactory.getLogger(AlbumResource.class);

    private static final String ENTITY_NAME = "album";

    private final AlbumRepository albumRepository;

    private final AlbumSearchRepository albumSearchRepository;

    public AlbumResource(AlbumRepository albumRepository, AlbumSearchRepository albumSearchRepository) {
        this.albumRepository = albumRepository;
        this.albumSearchRepository = albumSearchRepository;
    }

    /**
     * POST  /albums : Create a new album.
     *
     * @param album the album to create
     * @return the ResponseEntity with status 201 (Created) and with body the new album, or with status 400 (Bad Request) if the album has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/albums")
    @Timed
    public ResponseEntity<Album> createAlbum(@Valid @RequestBody Album album) throws URISyntaxException {
        log.debug("REST request to save Album : {}", album);
        if (album.getId() != null) {
            throw new BadRequestAlertException("A new album cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Album result = albumRepository.save(album);
        albumSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/albums/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /albums : Updates an existing album.
     *
     * @param album the album to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated album,
     * or with status 400 (Bad Request) if the album is not valid,
     * or with status 500 (Internal Server Error) if the album couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/albums")
    @Timed
    public ResponseEntity<Album> updateAlbum(@Valid @RequestBody Album album) throws URISyntaxException {
        log.debug("REST request to update Album : {}", album);
        if (album.getId() == null) {
            return createAlbum(album);
        }
        Album result = albumRepository.save(album);
        albumSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, album.getId().toString()))
            .body(result);
    }

    /**
     * GET  /albums : get all the albums.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of albums in body
     */
    @GetMapping("/albums")
    @Timed
    public ResponseEntity<List<Album>> getAllAlbums(Pageable pageable) {
        log.debug("REST request to get a page of Albums");
        Page<Album> page = albumRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/albums");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /albums/:id : get the "id" album.
     *
     * @param id the id of the album to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the album, or with status 404 (Not Found)
     */
    @GetMapping("/albums/{id}")
    @Timed
    public ResponseEntity<Album> getAlbum(@PathVariable Long id) {
        log.debug("REST request to get Album : {}", id);
        Album album = albumRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(album));
    }

    /**
     * DELETE  /albums/:id : delete the "id" album.
     *
     * @param id the id of the album to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/albums/{id}")
    @Timed
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        log.debug("REST request to delete Album : {}", id);
        albumRepository.delete(id);
        albumSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/albums?query=:query : search for the album corresponding
     * to the query.
     *
     * @param query the query of the album search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/albums")
    @Timed
    public ResponseEntity<List<Album>> searchAlbums(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Albums for query {}", query);
        Page<Album> page = albumSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/albums");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
