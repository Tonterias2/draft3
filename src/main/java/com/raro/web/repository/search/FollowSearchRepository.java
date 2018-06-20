package com.raro.web.repository.search;

import com.raro.web.domain.Follow;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Follow entity.
 */
public interface FollowSearchRepository extends ElasticsearchRepository<Follow, Long> {
}
