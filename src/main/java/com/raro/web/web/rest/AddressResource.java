package com.raro.web.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.raro.web.domain.Address;

import com.raro.web.repository.AddressRepository;
import com.raro.web.repository.search.AddressSearchRepository;
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
 * REST controller for managing Address.
 */
@RestController
@RequestMapping("/api")
public class AddressResource {

    private final Logger log = LoggerFactory.getLogger(AddressResource.class);

    private static final String ENTITY_NAME = "address";

    private final AddressRepository addressRepository;

    private final AddressSearchRepository addressSearchRepository;

    public AddressResource(AddressRepository addressRepository, AddressSearchRepository addressSearchRepository) {
        this.addressRepository = addressRepository;
        this.addressSearchRepository = addressSearchRepository;
    }

    /**
     * POST  /addresses : Create a new address.
     *
     * @param address the address to create
     * @return the ResponseEntity with status 201 (Created) and with body the new address, or with status 400 (Bad Request) if the address has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/addresses")
    @Timed
    public ResponseEntity<Address> createAddress(@Valid @RequestBody Address address) throws URISyntaxException {
        log.debug("REST request to save Address : {}", address);
        if (address.getId() != null) {
            throw new BadRequestAlertException("A new address cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Address result = addressRepository.save(address);
        addressSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/addresses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /addresses : Updates an existing address.
     *
     * @param address the address to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated address,
     * or with status 400 (Bad Request) if the address is not valid,
     * or with status 500 (Internal Server Error) if the address couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/addresses")
    @Timed
    public ResponseEntity<Address> updateAddress(@Valid @RequestBody Address address) throws URISyntaxException {
        log.debug("REST request to update Address : {}", address);
        if (address.getId() == null) {
            return createAddress(address);
        }
        Address result = addressRepository.save(address);
        addressSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, address.getId().toString()))
            .body(result);
    }

    /**
     * GET  /addresses : get all the addresses.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of addresses in body
     */
    @GetMapping("/addresses")
    @Timed
    public ResponseEntity<List<Address>> getAllAddresses(Pageable pageable) {
        log.debug("REST request to get a page of Addresses");
        Page<Address> page = addressRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/addresses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /addresses/:id : get the "id" address.
     *
     * @param id the id of the address to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the address, or with status 404 (Not Found)
     */
    @GetMapping("/addresses/{id}")
    @Timed
    public ResponseEntity<Address> getAddress(@PathVariable Long id) {
        log.debug("REST request to get Address : {}", id);
        Address address = addressRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(address));
    }

    /**
     * DELETE  /addresses/:id : delete the "id" address.
     *
     * @param id the id of the address to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/addresses/{id}")
    @Timed
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        log.debug("REST request to delete Address : {}", id);
        addressRepository.delete(id);
        addressSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/addresses?query=:query : search for the address corresponding
     * to the query.
     *
     * @param query the query of the address search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/addresses")
    @Timed
    public ResponseEntity<List<Address>> searchAddresses(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Addresses for query {}", query);
        Page<Address> page = addressSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/addresses");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
