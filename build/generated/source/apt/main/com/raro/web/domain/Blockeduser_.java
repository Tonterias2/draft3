package com.raro.web.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Blockeduser.class)
public abstract class Blockeduser_ {

	public static volatile SingularAttribute<Blockeduser, Party> blockeduser;
	public static volatile SingularAttribute<Blockeduser, Long> id;
	public static volatile SingularAttribute<Blockeduser, Instant> creationDate;
	public static volatile SingularAttribute<Blockeduser, Party> blockinguser;

}

